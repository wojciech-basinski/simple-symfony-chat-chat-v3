<?php declare(strict_types=1);

namespace App\Controller\Api;

use App\Utils\Channel;
use App\Utils\ChatConfig;
use App\Utils\Messages\AddMessage;
use App\Utils\Messages\MessageGetter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Translation\TranslatorInterface;

class ApiController extends Controller
{
    /**
     * @Route("/api/add/", name="api_message_add", methods={"POST"})
     *
     * Add new message
     *
     * Check if message can be added to database and add message to database
     */
    public function addAction(Request $request, AddMessage $message): JsonResponse
    {
        $parameters = json_decode($request->getContent(), true);
        $messageText = $parameters['text'] ?? null;
        $user = $this->getUser();
        $channel = $parameters['channel'] ?? null;

        return $message->addMessageToDatabase($user, $messageText, $channel);
    }

    /**
     * @Route("/api/initial/", name="api_initial", methods={"GET"})
     */
    public function initialAction(
        Request $request,
        Channel $channelUtil,
        ChatConfig $config,
        TranslatorInterface $translator,
        MessageGetter $messageGetter
    ): JsonResponse {
        $changeChannel = 0;
        $channel = (int) $request->query->get('channel') ?? 1;
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
     * @Route("/api/check", name="api_check_channel", methods={"GET"})
     *
     * Checks if user can subscribe channel via socket
     */
    public function checkChannelAction(Channel $channelService, Request $request): JsonResponse
    {
        $channel = (int) $request->query->get('channel') ?? 0;
        if ($channelService->checkIfUserCanBeOnThatChannel($this->getUser(), $channel)) {
            return new JsonResponse(json_encode(1));
        }
        return new JsonResponse(json_encode(0));
    }
}