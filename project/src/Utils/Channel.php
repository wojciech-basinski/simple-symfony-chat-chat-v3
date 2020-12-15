<?php declare(strict_types = 1);

namespace App\Utils;

use App\Entity\User;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class Channel
{
    private ChatConfig $config;

    private SessionInterface $session;

    private LoggerInterface $logger;


    public function __construct(
        ChatConfig $config,
        SessionInterface $session,
        LoggerInterface $logger
    ) {
        $this->config = $config;
        $this->session = $session;
        $this->logger = $logger;
    }

    public function checkIfUserCanBeOnThatChannel(User $user, ?int $channel): bool
    {
        if ($channel === null) {
            return false;
        }
        if ($channel === $this->config->getUserPrivateMessageChannelId($user)) {
            return true;
        }
        return array_key_exists($channel, $this->config->getChannels($user));
    }
}
