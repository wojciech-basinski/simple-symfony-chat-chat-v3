<?php declare(strict_types=1);

namespace App\Utils\EmitMessage;

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

class EmitNewMessage implements EmitMessage
{
    private Client $client;

    public function __construct(string $sockerPath)
    {
        $version = new Version2X($sockerPath);
        $this->client = new Client($version);
    }

    public function emitMessage(string $message, array $data = []): void
    {
        $this->client->initialize()
            ->emit("new_message", $data)
            ->close();
    }
}