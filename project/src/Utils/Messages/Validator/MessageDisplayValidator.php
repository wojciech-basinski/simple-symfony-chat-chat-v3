<?php declare(strict_types = 1);

namespace App\Utils\Messages\Validator;

use App\Entity\User;
use App\Utils\Channel;
use function count;
use function explode;

class MessageDisplayValidator
{
    private Channel $channel;

    public function __construct(Channel $channel)
    {
        $this->channel = $channel;
    }

    /**
     * Checking if message can be displayed on chat, unset messages that cannot be displayed
     *
     * @param array $messages messages as array
     *
     * @param User $user
     *
     * @return array checked messages
     */
    public function checkIfMessagesCanBeDisplayed(array $messages, User $user): array
    {
        $count = count($messages);
        for ($i = 0; $i < $count; $i++) {
            $textSplitted = explode(' ', $messages[$i]['text']);
            if ($textSplitted[0] === '/delete') {
                unset($messages[$i]);
                continue;
            }
            if (!$this->channel->checkIfUserCanBeOnThatChannel($user, (int)$messages[$i]['channel'])) {
                unset($messages[$i]);
                continue;
            }
        }

        return $messages;
    }
}
