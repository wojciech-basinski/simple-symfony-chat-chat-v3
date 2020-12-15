<?php declare(strict_types = 1);

namespace App\Utils\Messages\Transformers;

use App\Entity\Message;

class MessageToArrayTransformer
{
    private SpecialMessageDisplayTransformer $specialMessageDisplayTransformer;

    public function __construct(SpecialMessageDisplayTransformer $specialMessageDisplayTransformer)
    {
        $this->specialMessageDisplayTransformer = $specialMessageDisplayTransformer;
    }

    public function transformMessagesToArray(array $messages): array
    {
        $messagesArray = [];
        foreach ($messages as $message) {
            $messagesArray[] = $this->createArray($message);
        }
        return $messagesArray;
    }

    private function createArray(Message $message): array
    {
        $text = $this->specialMessageDisplayTransformer->specialMessagesDisplay($message->getText());

        $returnedArray = [
            'id' => $message->getId(),
            'userId' => $message->getUserInfo()->getId(),
            'date' => $message->getDate(),
            'text' => $text['showText'] ?? $message->getText(),
            'channel' => $message->getChannel(),
            'userName' => $message->getUsername(),
            'userRole' => $message->getRole(),
            'privateMessage' => $text['privateMessage'] ?? 0,
            'userAvatar' => $message->getUserAvatar()
        ];

        $textSplitted = explode(' ', $message->getText());
        if ($textSplitted[0] === '/delete') {
            $returnedArray['id'] = $textSplitted[1];
            $returnedArray['text'] = 'delete';
        }
        return $returnedArray;
    }
}
