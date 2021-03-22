<?php declare(strict_types = 1);

namespace App\Controller;

use App\Utils\Channel;
use App\Utils\ChatConfig;
use App\Utils\Messages\AddMessage;
use App\Utils\Messages\DeleteMessage;
use App\Utils\Messages\MessageGetter;
use App\Utils\UserOnline;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
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
        Channel $channelService,
        ChatConfig $config,
        SessionInterface $session,
        EngineInterface $twig,
        JWTTokenManagerInterface $jwtManager
    ): Response {
        $user = $this->getUser();
        $channel = $session->get('channel');
        if (!$channelService->checkIfUserCanBeOnThatChannel($user, $channel)) {
            $channel = 1;
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
            'privateMessageChannelId' => $config->getUserPrivateMessageChannelId($user),
            'token' => $jwtManager->create($user)
        ]);
        $response->setContent($body);
        $response->headers->set('Access-Control-Allow-Origin', '*');//TODO array z youtueb

        return $response;
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
     *
     * @return RedirectResponse Redirect to fos logout
     */
    public function logoutAction(): Response
    {
        //TODO remove from online socket
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
        if (strpos($url, '..') !== false) {
            $url = null;
        }
        $response = new Response();
        $disposition = $response->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_INLINE, 'name');
        $response->headers->set('Content-Disposition', $disposition);
        $response->headers->set('Content-Type', 'image/jpeg');
        $response->setContent(\file_get_contents($url));
        return $response;
    }
}
