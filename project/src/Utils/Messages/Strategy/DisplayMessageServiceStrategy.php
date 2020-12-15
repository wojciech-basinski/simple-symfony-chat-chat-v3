<?php declare(strict_types = 1);

namespace App\Utils\Messages\Strategy;

use App\Utils\Messages\SpecialMessages\Display\SpecialMessageDisplay;

class DisplayMessageServiceStrategy
{
    /**
     * @var iterable<SpecialMessageDisplay>
     */
    private iterable $specialMessageDisplays;

    public function __construct(
        iterable $specialMessageDisplays
    ) {
        $this->specialMessageDisplays = $specialMessageDisplays;
    }

    public function getDisplayMessage(string $text): ?array
    {
        $textSplitted = explode(' ', $text, 2);

        foreach($this->specialMessageDisplays as $service) {
            if($service->canDisplay($textSplitted[0])) {
                return $service->display($textSplitted);
            }
        }

        return null;
    }
}
