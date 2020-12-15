<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Create;

use App\Entity\User;
use App\Utils\Messages\Database\AddMessageToDatabase;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class AfkMessageCreate implements SpecialMessageAdd
{
    /**
     * @var EntityManagerInterface
     */
    private $em;
    /**
     * @var SessionInterface
     */
    private $session;
    /**
     * @var AddMessageToDatabase
     */
    private $addMessageToDatabase;

    public function __construct(
        EntityManagerInterface $em,
        SessionInterface $session,
        AddMessageToDatabase $addMessageToDatabase
    ) {
        $this->em = $em;
        $this->session = $session;
        $this->addMessageToDatabase = $addMessageToDatabase;
    }

    public function canAdd(string $text): bool
    {
        return $text === '/zw' || $text === '/afk' || $text === '/jj';
    }

    /**
     * Add special message
     *
     * @param array $text
     * @param User $user
     * @param int $channel
     *
     * @return bool
     */
    public function add(array $text, User $user, int $channel): bool
    {
        return $this->afk($text, $user, $channel);
    }

    private function afk(array $text, User $user, int $channel): bool
    {
        //TODO?
        return true;
    }

    private function removeAfk(array $text, User $user, int $channel): bool
    {

        if (!isset($text[1])) {
            $this->session->set('afk', false);
            $this->addMessageToDatabase->addBotMessage(
                $this->createReturnFromAfkText($user),
                $channel
            );
        }

        return true;
    }

    private function createAfkText(User $user): string
    {
        return '/afk '.$user->getUsername();
    }

    private function createReturnFromAfkText(User $user): string
    {
        return '/returnAfk '.$user->getUsername();
    }
}
