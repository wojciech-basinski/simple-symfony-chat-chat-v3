<?php declare(strict_types = 1);

namespace App\Utils\Messages\Transformers;

use App\Utils\Messages\Strategy\DisplayMessageServiceStrategy;

class SpecialMessageDisplayTransformer
{
    private DisplayMessageServiceStrategy $messageServiceStrategy;

    public function __construct(DisplayMessageServiceStrategy $messageServiceStrategy)
    {
        $this->messageServiceStrategy = $messageServiceStrategy;
    }

    public function specialMessagesDisplay(string $text): ?array
    {
        return $this->messageServiceStrategy->getDisplayMessage($text);
    }
}
