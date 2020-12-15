<?php declare(strict_types = 1);

namespace App\Utils\Messages\Validator;

use App\Entity\User;
use App\Utils\ChatConfig;
use Symfony\Component\Translation\TranslatorInterface;
use function array_key_exists;
use function strlen;
use function strpos;
use function strtolower;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use function trim;

class AddMessageValidator
{

    private SessionInterface $session;

    private ChatConfig $config;

    private TranslatorInterface $translator;

    public function __construct(SessionInterface $session, ChatConfig $config, TranslatorInterface $translator)
    {
        $this->session = $session;
        $this->config = $config;
        $this->translator = $translator;
    }

    /**
     * Validating if message is valid (not empty etc.) or User and Channel exists
     *
     * @param User $user User instance
     *
     * @param int $channel Channel's id
     *
     * @param string $text message text
     *
     * @return bool status
     */
    public function validateMessage(User $user, int $channel, ?string $text): bool
    {
        $text = strtolower(trim($text));
        if ($text === null || strlen($text) <= 0) {
            $errorMessage = $this->translator->trans(
                'error.emptyMessage',
                [],
                'chat',
                $this->translator->getLocale()
            );
            $this->session->set('errorMessage', $errorMessage);
            return false;
        }
        if ($user->getId() <= 0) {
            $errorMessage = $this->translator->trans(
                'error.notLoggedIn',
                [],
                'chat',
                $this->translator->getLocale()
            );
            $this->session->set('errorMessage', $errorMessage);
            return false;
        }
        if (!array_key_exists($channel, $this->config->getChannels($user))) {
            $errorMessage = $this->translator->trans(
                'error.notPermittedChannel',
                [],
                'chat',
                $this->translator->getLocale()
            );
            $this->session->set('errorMessage', $errorMessage);
            return false;
        }
        if (strpos($text, '(pm)') === 0) {
            $errorMessage = $this->translator->trans(
                'error.messageStartedFromPm',
                [],
                'chat',
                $this->translator->getLocale()
            );
            $this->session->set('errorMessage', $errorMessage);
            return false;
        }
        if (strpos($text, '(pw)') === 0) {
            $errorMessage = $this->translator->trans(
                'error.messageStartedFromPw',
                [],
                'chat',
                $this->translator->getLocale()
            );
            $this->session->set('errorMessage', $errorMessage);
            return false;
        }

        return true;
    }
}
