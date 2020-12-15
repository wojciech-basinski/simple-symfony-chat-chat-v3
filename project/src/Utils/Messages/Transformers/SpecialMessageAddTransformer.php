<?php declare(strict_types = 1);

namespace App\Utils\Messages\Transformers;

use App\Entity\User;
use App\Utils\Messages\Strategy\AddMessageServiceStrategy;

class SpecialMessageAddTransformer
{
    private AddMessageServiceStrategy $messageServiceFactory;

    public function __construct(AddMessageServiceStrategy $messageServiceFactory)
    {
        $this->messageServiceFactory = $messageServiceFactory;
    }

    /**
     * @param string $text
     * @param User $user
     * @param int $channel
     *
     * @return null | bool
     */
    public function specialMessagesAdd(string $text, User $user, int $channel): ?bool
    {
        return $this->messageServiceFactory->addSpecialMessage($text, $user, $channel);
    }
}
