<?php declare(strict_types = 1);

namespace App\EventListener;

use App\Entity\Message;
use App\Utils\EmitMessage\EmitMessage;
use App\Utils\Messages\Transformers\MessageToArrayTransformer;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class MessagePostPersist
{
    private EmitMessage $emitMessage;
    private MessageToArrayTransformer $messageToArrayTransformer;

    public function __construct(EmitMessage $emitMessage, MessageToArrayTransformer $messageToArrayTransformer)
    {
        $this->emitMessage = $emitMessage;
        $this->messageToArrayTransformer = $messageToArrayTransformer;
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if ($entity instanceof Message) {
            $this->emitMessage->emitMessage("new_message", [
               'channel' => $entity->getChannel(),
               'message' => $this->messageToArrayTransformer->transformMessagesToArray([$entity])[0]
            ]);
        }
    }
}
