<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Display;

use App\Utils\ChatConfig;
use Symfony\Component\Translation\TranslatorInterface;

class InvitedMessageDisplay implements SpecialMessageDisplay
{
    /**
     * @var TranslatorInterface
     */
    private $translator;
    /**
     * @var ChatConfig
     */
    private $config;

    public function __construct(TranslatorInterface $translator, ChatConfig $config)
    {
        $this->translator = $translator;
        $this->config = $config;
    }

    public function canDisplay(string $text): bool
    {
        return $text === '/invited';
    }

    /**
     * Display special message
     */
    public function display(array $textSplitted): array
    {
        $textSplitted = explode(' ', $textSplitted[1]);
        $text = $this->translator->trans(
            'chat.invitationSent',
            [
                'chat.user' => $textSplitted[0],
                'chat.channel' => $textSplitted[1]
            ],
            'chat',
            $this->translator->getLocale()
        );

        return [
            'showText' => $text,
            'userId' => $this->config->getBotId()
        ];
    }
}
