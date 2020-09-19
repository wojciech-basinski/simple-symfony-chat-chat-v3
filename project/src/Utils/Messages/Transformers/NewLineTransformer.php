<?php declare(strict_types = 1);

namespace App\Utils\Messages\Transformers;

class NewLineTransformer
{
    public function transformLine(string $string): string
    {
        return str_replace(["\r\n", "\r", "\n"], '<br />', $string);
    }
}
