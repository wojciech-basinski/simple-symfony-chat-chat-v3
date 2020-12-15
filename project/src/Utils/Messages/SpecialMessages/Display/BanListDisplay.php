<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Display;

use App\Utils\ChatConfig;
use Symfony\Component\Translation\TranslatorInterface;

class BanListDisplay implements SpecialMessageDisplay
{
    /**
     * @var TranslatorInterface
     */
    private $translator;
    /**
     * @var ChatConfig
     */
    private $config;

    public function __construct(TranslatorInterface $translator, ChatConfig  $config)
    {
        $this->translator = $translator;
        $this->config = $config;
    }

    public function canDisplay(string $text): bool
    {
        return $text === '/banlist';
    }

    /**
     * Display special message
     */
    public function display(array $textSplitted): array
    {
        $text = $this->translator->trans(
            'chat.bannedUser',
            [],
            'chat',
            $this->translator->getLocale()
        );

        return [
            'showText' => $text . ' ' . $textSplitted[1],
            'userId' => $this->config->getBotId()
        ];
    }
}
