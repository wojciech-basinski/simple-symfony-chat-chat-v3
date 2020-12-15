<?php declare(strict_types = 1);

namespace App\Utils\Messages\Strategy;

use App\Entity\User;
use App\Utils\Messages\SpecialMessages\Create\SpecialMessageAdd;

class AddMessageServiceStrategy
{
    /**
     * @var iterable<SpecialMessageAdd>
     */
    private iterable $specialMessageCreators;

    public function __construct(
        iterable $specialMessageCreators
    ) {
        $this->specialMessageCreators = $specialMessageCreators;
    }

    public function addSpecialMessage(string $text, User $user, int $channel): ?bool
    {
        $textSplitted = explode(' ', $text, 2);

        foreach ($this->specialMessageCreators as $service) {
            if ($service->canAdd($textSplitted[0])) {
                return $service->add($textSplitted, $user, $channel);
            }
        }

        return null;
    }
}
