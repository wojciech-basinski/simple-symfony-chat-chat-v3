<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Display;

use App\Utils\ChatConfig;
use Symfony\Component\Translation\TranslatorInterface;

class RollMessageDisplay implements SpecialMessageDisplay
{
    private TranslatorInterface $translator;

    private ChatConfig $config;

    public function __construct(TranslatorInterface $translator, ChatConfig $config)
    {
        $this->translator = $translator;
        $this->config = $config;
    }

    public function display(array $textSplitted): array
    {
        $textSplitted = explode(' ', $textSplitted[1], 3);
        $text = $textSplitted[1] . ' ' .
            $this->translator->trans(
                'chat.roll',
                ['chat.dice' => $textSplitted[0]],
                'chat',
                $this->translator->getLocale()
            ) . ' ' . $textSplitted[2];

        return [
            'showText' => $text,
            'userId' => $this->config->getBotId()
        ];
    }
}
