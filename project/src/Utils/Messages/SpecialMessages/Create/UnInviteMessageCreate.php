<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Create;

use App\Entity\Invite;
use App\Entity\User;
use App\Utils\ChatConfig;
use App\Utils\Messages\Database\AddMessageToDatabase;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Translation\TranslatorInterface;

class UnInviteMessageCreate implements SpecialMessageAdd
{
    /**
     * @var TranslatorInterface
     */
    private $translator;
    /**
     * @var ChatConfig
     */
    private $config;
    /**
     * @var SessionInterface
     */
    private $session;
    /**
     * @var EntityManagerInterface
     */
    private $em;
    /**
     * @var AddMessageToDatabase
     */
    private $addMessageToDatabase;

    public function __construct(
        TranslatorInterface $translator,
        ChatConfig $config,
        SessionInterface $session,
        EntityManagerInterface $em,
        AddMessageToDatabase $addMessageToDatabase
    ) {
        $this->translator = $translator;
        $this->config = $config;
        $this->session = $session;
        $this->em = $em;
        $this->addMessageToDatabase = $addMessageToDatabase;
    }

    public function canAdd(string $text): bool
    {
        return $text === '/uninvite';
    }
    /**
     * Add special message
     *
     * @param array $textSplitted
     * @param User $user
     * @param int $channel
     *
     * @return bool
     */
    public function add(array $textSplitted, User $user, int $channel): bool
    {
        if (count($textSplitted) < 2) {
            return $this->wrongUsernameError();
        }
        if ($this->session->get('channel') === 1) {
            return $this->wrongChannelError();
        }
        /** @var User|null $userToInvite */
        $userToInvite = $this->em->getRepository('App:User')->findOneBy(['username' => $textSplitted[1]]);
        return $this->unInvite($userToInvite, $user, $textSplitted);
    }

    private function unInvite(?User $userToInvite, User $user, array $textSplitted): bool
    {
        if (!$userToInvite) {
            return $this->userNotFoundError($textSplitted);
        }
        if ($user->getId() === $userToInvite->getId()) {
            return $this->sentYourselfUnInvitationError();
        }
        /** @var Invite|null $invite */
        $invite = $this->em->getRepository('App:Invite')->findOneBy([
            'channelId' => $this->session->get('channel'),
            'userId' => $userToInvite->getId()
        ]);
        if ($invite === null) {
            return $this->unInvitationSentError($userToInvite->getUsername());
        }
        $this->addUnInvitation($userToInvite, $user, $invite);

        return true;
    }

    private function addUnInvitation(User $userToInvite, User $user, Invite $invite): void
    {
        $this->em->remove($invite);
        $this->em->flush();

        $channel = ($this->session->get('channel') === $this->config->getUserPrivateMessageChannelId($user)) ?
            $user->getUsername() : $this->config->getChannels($user)[$this->session->get('channel')];

        $this->addMessageToDatabase->addBotMessage(
            "/uninvite {$user->getUsername()} $channel",
            $this->config->getUserPrivateMessageChannelId($userToInvite)
        );
        $this->addMessageToDatabase->addBotMessage(
            "/uninvited {$userToInvite->getUsername()} $channel",
            $this->config->getUserPrivateMessageChannelId($user)
        );
    }

    private function wrongUsernameError(): bool
    {
        return $this->returnError('error.wrongUsername');
    }

    private function unInvitationSentError(string $username): bool
    {
        return $this->returnError('error.invitationNotSent', ['chat.user' => $username]);
    }

    private function sentYourselfUnInvitationError(): bool
    {
        return $this->returnError('error.uninviteYourself');
    }

    private function userNotFoundError(array $textParts): bool
    {
        return $this->returnError('error.userNotFound', ['chat.nick' => $textParts[1]]);
    }

    private function wrongChannelError(): bool
    {
        return $this->returnError('error.channelCantUninvite');
    }

    private function returnError(string $errorId, array $parameters = []): bool
    {
        $errorText = $this->translator->trans(
            $errorId,
            $parameters,
            'chat',
            $this->translator->getLocale()
        );
        $this->session->set(
            'errorMessage',
            $errorText
        );
        return false;
    }
}
