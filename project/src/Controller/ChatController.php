<?php declare(strict_types = 1);

namespace App\Controller;

use App\Entity\Message;
use App\Repository\MessageRepository;
use App\Utils\Cache\GetBotUserFromCache;
use App\Utils\Channel;
use App\Utils\ChatConfig;
use App\Utils\EmitMessage\EmitNewMessage;
use App\Utils\Messages\AddMessage;
use App\Utils\Messages\DeleteMessage;
use App\Utils\Messages\MessageGetter;
use App\Utils\UserOnline;
use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;
use Monolog\Logger;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Translation\TranslatorInterface;

class ChatController extends Controller
{
    /**
     * @Route("/chat/", name="chat_index")
     */
    public function showAction(
        Request $request,
        UserOnline $userOnline,
        Channel $channelService,
        ChatConfig $config,
        SessionInterface $session,
        EngineInterface $twig
    ): Response {
        $user = $this->getUser();
        $channel = $session->get('channel');
        if (!$channelService->checkIfUserCanBeOnThatChannel($user, $channel)) {
            $channel = 1;
            $session->set('channel', 1);
        }

        if ($userOnline->updateUserOnline($user, $channel, false)) {
            return $this->redirectToRoute('banned');
        }
        $response = new Response();
        $body = $twig->render('chat/index.html.twig', [
            'user' => $user,
            'user_channel' => $channel,
            'channels' => $config->getChannels($user),
            'locale' => $request->getLocale(),
            'botId' => $config->getBotId(),
            'channel' => $channel,
            'privateChannelId' => $config->getUserPrivateMessageChannelId($user),
            'privateMessageChannelId' => $config->getUserPrivateMessageChannelId($user)
        ]);
        $response->setContent($body);
        $response->headers->set('Access-Control-Allow-Origin', '*');//TODO array z youtueb

        return $response;
    }

    /**
     * @Route("/chat/add/", name="chat_add", methods={"POST"})
     *
     * Add new message
     *
     * Check if message can be added to database and get messages that was wrote between
     * last refresh and calling this method
     */
    public function addAction(Request $request, AddMessage $message): JsonResponse
    {
        $parameters = json_decode($request->getContent(), true);
        $messageText = $parameters['text'] ?? null;
        $user = $this->getUser();
        $channel = $parameters['channel'] ?? null;

        $response = $message->addMessageToDatabase($user, $messageText, $channel);

        return $response;

    }

    /**
     * @Route("chat/guwno")
     */
    public function guwno(GetBotUserFromCache $bot)
    {
        /** @var MessageRepository $repository */
        $repository = $this->getDoctrine()->getRepository(Message::class);
        $repository->addBotMessage('chuj', 1, $bot->getChatBotUser(), 'hasbgfkhjasf');

        die;
    }
    /**
     * @Route("/chat/initial/", name="chat_get_initial", methods={"POST"})
     */
    public function initialAction(
        Request $request,
        UserOnline $userOnlineService,
        Channel $channel,
        SessionInterface $session,
        ChatConfig $config,
        TranslatorInterface $translator,
        MessageGetter $messageGetter
    ): Response {
        $messages = $messageGetter->getMessagesInIndex($this->getUser());
//
//        $typing = $request->request->get('typing');
//        $typing = \in_array($typing, [0, 1]) ? $typing : 0;

        $changeChannel = 0;
//        if ($userOnlineService->updateUserOnline($this->getUser(), $session->get('channel'), (bool) $typing)) {
//            return new JsonResponse(['banned']);
//        }

        if (!$channel->checkIfUserCanBeOnThatChannel($this->getUser(), $session->get('channel'))) {
            $session->set('channel', 1);
            $session->set('channelChanged', 1);
            $changeChannel = 1;
        }

//        $usersOnline = $userOnlineService
//            ->getOnlineUsers(
//                $this->getUser()->getId(),
//                $session->get('channel')
//            );
        $channels = [];
        foreach ($config->getChannels($this->getUser()) as $key => $value) {
            $channelNameTranslated = $translator->trans('channel.' . $value, [], 'chat', $translator->getLocale());
            $channels[$key] = ($channelNameTranslated !== 'channel.' . $value) ? $channelNameTranslated : $value;
        }
        $return = [
            'messages' => $messages,
//            'usersOnline' => $usersOnline,
            'kickFromChannel' => $changeChannel,
            'channels' => $channels
        ];
        return new JsonResponse($return);
    }

    /**
     * @Route("/chat/delete/", name="chat_delete")
     * @Security("has_role('ROLE_MODERATOR')")
     *
     * Delete message from database
     *
     * Checking if message exists in database and then delete it from database,
     * add message to database that message was deleted and by whom
     *
     * @param Request $request A Request instance
     * @param DeleteMessage $message
     *
     * @return JsonResponse status true or false
     * @throws \Exception
     */
    public function deleteAction(Request $request, DeleteMessage $message): Response
    {
        $id = $request->get('messageId');
        $user = $this->getUser();
        if (!$id) {
            return $this->json(['status' => 0]);
        }

        $status = $message->deleteMessage((int) $id, $user);

        return $this->json(['status' => $status]);
    }

    /**
     * @Route("/chat/logout", name="chat_logout")
     *
     * Logout from chat
     * Delete User's info from online users in database and then redirect to logout in fosuserbundle
     *
     * @param UserOnline $userOnlineService
     *
     * @return RedirectResponse Redirect to fos logout
     */
    public function logoutAction(UserOnline $userOnlineService): Response
    {
        $userOnlineService->deleteUserWhenLogout($this->getUser()->getId());

        return $this->redirectToRoute('fos_user_security_logout');
    }

    /**
     * @Route("/chat/channel", name="change_channel_chat")
     *
     * Change channel on chat
     *
     * Checking if channel exists and change user's channel in session
     *
     * @param Request $request A Request instance
     * @param Channel $channelService
     *
     * @return JsonResponse returns status of changing channel
     */
    public function changeChannelAction(Request $request, Channel $channelService): Response
    {
        $channel = $request->request->get('channel');
        if (!$channel) {
            return $this->json('false');
        }
        $return = $channelService->changeChannelOnChat($this->getUser(), (int) $channel);

        return $this->json($return);
    }

    /**
     * @Route("/img/", name="reverse_proxy_img")
     * @param Request $request
     *
     * @return Response
     */
    public function reverseProxyAction(Request $request): Response
    {
        $url = $request->query->get('url');
        $response = new Response();
        $disposition = $response->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_INLINE, 'name');
        $response->headers->set('Content-Disposition', $disposition);
        $response->headers->set('Content-Type', 'image/jpeg');
        $response->setContent(\file_get_contents($url));
        return $response;
    }
}
