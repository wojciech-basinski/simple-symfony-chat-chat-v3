<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Create;

use App\Entity\User;

interface SpecialMessageAdd
{
    /**
     * check if service can add message
     */
    public function canAdd(string $text): bool;

    /**
     * Add special message
     */
    public function add(array $text, User $user, int $channel): bool;
}
