<?php declare(strict_types = 1);

namespace App\Controller;

use App\Utils\Channel;
use App\Utils\ChatConfig;
use App\Utils\Messages\AddMessage;
use App\Utils\Messages\DeleteMessage;
use App\Utils\Messages\MessageGetter;
use App\Utils\UserOnline;
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
     * @Route("/chat/initial/", name="chat_get_initial", methods={"POST"})
     */
    public function initialAction(
        Request $request,
        UserOnline $userOnlineService,
        Channel $channelUtil,
        SessionInterface $session,
        ChatConfig $config,
        TranslatorInterface $translator,
        MessageGetter $messageGetter
    ): Response {
        $changeChannel = 0;
        $parameters = json_decode($request->getContent(), true);
        $channel = $parameters['channel'] ?? 1;
        $canBeOnChannel = $channelUtil->checkIfUserCanBeOnThatChannel($this->getUser(), $channel);
        if (!$canBeOnChannel) {
            $channel = 1;
            $changeChannel = 1;
        }
        $messages = $messageGetter->getMessages($this->getUser(), $channel);
        $channels = [];
        foreach ($config->getChannels($this->getUser()) as $key => $value) {
            $channelNameTranslated = $translator->trans('channel.' . $value, [], 'chat', $translator->getLocale());
            $channels[$key] = ($channelNameTranslated !== 'channel.' . $value) ? $channelNameTranslated : $value;
        }
        $return = [
            'messages' => $messages,
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
