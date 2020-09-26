<?php declare(strict_types = 1);

namespace App\Utils\Messages;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
use App\Utils\Channel;
use App\Utils\ChatConfig;
use App\Utils\Messages\Transformers\MessageToArrayTransformer;
use App\Utils\Messages\Validator\MessageDisplayValidator;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;
use function end;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use function usort;

class MessageGetter
{
    private EntityManagerInterface $em;

    private SessionInterface $session;

    private ChatConfig $config;

    private LoggerInterface $logger;

    private MessageToArrayTransformer $messageTransformer;

    private MessageDisplayValidator $messageDisplayValidator;

    private MessageRepository $messageRepository;

    public function __construct(
        EntityManagerInterface $em,
        SessionInterface $session,
        ChatConfig $config,
        LoggerInterface $logger,
        MessageToArrayTransformer $messageTransformer,
        MessageDisplayValidator $messageDisplayValidator
    ) {
        $this->em = $em;
        $this->session = $session;
        $this->config = $config;
        $this->logger = $logger;
        $this->messageTransformer = $messageTransformer;
        $this->messageDisplayValidator = $messageDisplayValidator;
        $this->initializeRepository();
    }

    /**
     * Gets messages from last 24h limited by chat limit, than set id of last message to session
     * than change messages from entities to array
     */
    public function getMessages(User $user, int $channel): array
    {
        $channelPrivateMessage = $this->config->getUserPrivateMessageChannelId($user);
        $messages = $this->messageRepository->getMessagesFromLastDay($channel, $channelPrivateMessage);

        $this->session->set(
            'lastId',
            $this->messageRepository->getIdFromLastMessage()
        );

        $messages = $this->messageTransformer->transformMessagesToArray($messages);

        return $this->messageDisplayValidator->checkIfMessagesCanBeDisplayed($messages, $user);
    }

    private function initializeRepository(): void
    {
        $repository = $this->em->getRepository(Message::class);
        if (!$repository instanceof MessageRepository) {
            throw new RuntimeException('Could not find repository');
        }
        $this->messageRepository = $repository;
    }
}
