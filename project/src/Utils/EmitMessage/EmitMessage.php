<?php declare(strict_types = 1);

namespace App\Utils\EmitMessage;

interface EmitMessage
{
    public function emitMessage(string $message, array $data = []): void;
}
