<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Display;

interface SpecialMessageDisplay
{
    /**
     * Display special message
     */
    public function display(array $text): array;
}
