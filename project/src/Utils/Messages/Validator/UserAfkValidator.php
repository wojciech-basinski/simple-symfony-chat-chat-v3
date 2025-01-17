<?php declare(strict_types = 1);

namespace App\Utils\Messages\Validator;

use Symfony\Component\HttpFoundation\Session\SessionInterface;

class UserAfkValidator
{
    public const AFK_MESSAGES_KEYS = [
        '/afk',
        '/zw',
        '/jj'
    ];

    private SessionInterface $session;

    public function __construct(SessionInterface $session)
    {
        $this->session = $session;
    }

    public function validateUserAfk(string $text): bool
    {
        $textSplitted = explode(' ', $text, 2);
        return $this->session->get('afk') && !in_array($textSplitted[0], self::AFK_MESSAGES_KEYS, true);
    }
}
