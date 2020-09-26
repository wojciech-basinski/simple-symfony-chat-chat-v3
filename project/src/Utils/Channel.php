<?php declare(strict_types = 1);

namespace App\Utils;

use App\Entity\User;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class Channel
{
    private ChatConfig $config;

    private SessionInterface $session;

    private UserOnline $userOnline;

    private LoggerInterface $logger;

    /**
     * Channel constructor.
     *
     * @param ChatConfig $config
     * @param SessionInterface $session
     * @param UserOnline $userOnline
     * @param LoggerInterface $logger
     */
    public function __construct(
        ChatConfig $config,
        SessionInterface $session,
        UserOnline $userOnline,
        LoggerInterface $logger
    ) {
        $this->config = $config;
        $this->session = $session;
        $this->userOnline = $userOnline;
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
