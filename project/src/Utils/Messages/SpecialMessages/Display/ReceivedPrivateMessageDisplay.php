<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Display;

use Symfony\Component\Translation\TranslatorInterface;

class ReceivedPrivateMessageDisplay implements SpecialMessageDisplay
{
    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    public function canDisplay(string $text): bool
    {
        return $text === '/privMsg';
    }

    public function display(array $textSplitted): array
    {
        $text = $this->translator->trans(
            'chat.privFrom',
            [],
            'chat',
            $this->translator->getLocale()
        ) . ' ' . $textSplitted[1];

        return [
            'showText' => $text,
            'userId' => false,
            'privateMessage' => 1
        ];
    }
}
