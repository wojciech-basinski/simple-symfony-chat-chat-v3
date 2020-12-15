<?php declare(strict_types = 1);

namespace App\Utils;

use App\Entity\Invite;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class ChatConfig
{
    /**
     * @var int time in second when user is logout from chat when he is inactivity
     */
    private const INACTIVE_TIME = 180;

    /**
     * @var array array of channels
     * DO NOT CHANGE FIRST CHANNEL
     */
    private const DEFAULT_CHANNELS = [
        1 => 'Default',
        2 => 'Other',
        5 => 'Test'
    ];

    /**
     * @var int moderator channel id
     */
    private const MODERATOR_CHANNEL_ID = 3;

    /**
     * @var int admin channel id
     */
    private const ADMIN_CHANNEL_ID = 4;

    private AuthorizationCheckerInterface $auth;

    private int $botId;

    private int $rollCoolDown;

    /**
     * @var int added to private channel id
     */
    private const PRIVATE_CHANNEL_ADD = 1000000;

    /**
     * @var int added to private message channel id
     */
    private const PRIVATE_MESSAGE_ADD = 500000;

    private EntityManagerInterface $em;

    private ?array $invitations = null;

    public function __construct(
        AuthorizationCheckerInterface $auth,
        EntityManagerInterface $em,
        int $rollCoolDown,
        int $botId
    ) {
        $this->auth = $auth;
        $this->em = $em;
        $this->rollCoolDown = $rollCoolDown;
        $this->botId = $botId;
    }

    /**
     * @param User $user
     *
     * @return array Array of channels
     */
    public function getChannels(User $user): array
    {
        return self::DEFAULT_CHANNELS +
            $this->specialChannels() +
            $this->getUserPrivateChannel($user) +
            $this->getChannelsFromInvitations($user);
    }

    public function getDefaultChannels(): array
    {
        return self::DEFAULT_CHANNELS;
    }

    public function getBotId(): int
    {
        return $this->botId;
    }

    public function getInactiveTime(): int
    {
        return self::INACTIVE_TIME;
    }

    public function getUserPrivateChannel(User $user): array
    {
        $channelId = $this->getUserPrivateChannelId($user);
        return [
            $channelId => 'Private'
        ];
    }

    public function getUserPrivateChannelId(User $user): int
    {
        return self::PRIVATE_CHANNEL_ADD + $user->getId();
    }

    public function getPrivateMessageAdd(): int
    {
        return self::PRIVATE_MESSAGE_ADD;
    }

    public function getUserPrivateMessageChannelId(User $user): int
    {
        return self::PRIVATE_MESSAGE_ADD + $user->getId();
    }

    public function getRollCoolDown(): int
    {
        return $this->rollCoolDown;
    }

    private function specialChannels(): array
    {
        $array = [];
        if ($this->auth->isGranted('ROLE_ADMIN')) {
            $array[self::ADMIN_CHANNEL_ID] = $this->getChannelName(self::ADMIN_CHANNEL_ID);
        }
        if ($this->auth->isGranted('ROLE_MODERATOR')) {
            $array[self::MODERATOR_CHANNEL_ID] = $this->getChannelName(self::MODERATOR_CHANNEL_ID);
        }
        return $array;
    }

    private function getChannelsFromInvitations(User $user): array
    {
        if ($this->invitations !== null) {
            return $this->invitations;
        }
        /** @var Invite[] $invitations */
        $invitations = $this->em->getRepository(Invite::class)->findBy([
            'userId' => $user->getId()
        ]);
        if (!$invitations) {
            $this->invitations = [];
            return [];
        }

        $return = [];
        foreach ($invitations as $invitation) {
            $channelId = $invitation->getChannelId();
            $return[$channelId] = $this->getChannelName($channelId);
        }
        $this->invitations = $return;
        return $return;
    }

    private function getChannelName(int $id): string
    {
        switch ($id) {
            case self::ADMIN_CHANNEL_ID:
                return 'Admin';
            case self::MODERATOR_CHANNEL_ID:
                return 'Moderator';
            default:
                return $this->getUserPrivateChannelName($id);
        }
    }

    private function getUserPrivateChannelName(int $id): string
    {
        $id -= self::PRIVATE_CHANNEL_ADD;
        /** @var User|null $user */
        $user = $this->em->find('App:User', $id);
        if ($user === null) {
            return '';
        }
        return $user->getUsername();
    }
}
