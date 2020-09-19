<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Create;

use App\Entity\User;

interface SpecialMessageAdd
{
    /**
     * Add special message
     *
     * @param array $text
     * @param User $user
     * @param int $channel
     *
     * @return bool
     */
    public function add(array $text, User $user, int $channel): bool;
}
