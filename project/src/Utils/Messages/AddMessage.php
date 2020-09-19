<?php declare(strict_types = 1);

namespace App\Utils\Messages;

use App\Entity\User;
use App\Utils\Messages\Database\AddMessageToDatabase;
use App\Utils\Messages\Transformers\NewLineTransformer;
use App\Utils\Messages\Transformers\SpecialMessageAddTransformer;
use App\Utils\Messages\Validator\AddMessageValidator;
use App\Utils\Messages\Validator\UserAfkValidator;
use function htmlentities;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class AddMessage
{
    /**
     * @var AddMessageValidator
     */
    private $addMessageValidator;
    /**
     * @var SessionInterface
     */
    private $session;
    /**
     * @var UserAfkValidator
     */
    private $userAfkValidator;
    /**
     * @var SpecialMessageAddTransformer
     */
    private $specialMessageAddTransformer;
    /**
     * @var AddMessageToDatabase
     */
    private $addMessageToDatabase;
    /**
     * @var NewLineTransformer
     */
    private $newLineTransformer;

    public function __construct(
        AddMessageValidator $addMessageValidator,
        SessionInterface $session,
        UserAfkValidator $userAfkValidator,
        SpecialMessageAddTransformer $specialMessageAddTransformer,
        AddMessageToDatabase $addMessageToDatabase,
        NewLineTransformer $newLineTransformer
    ) {
        $this->addMessageValidator = $addMessageValidator;
        $this->session = $session;
        $this->userAfkValidator = $userAfkValidator;
        $this->specialMessageAddTransformer = $specialMessageAddTransformer;
        $this->addMessageToDatabase = $addMessageToDatabase;
        $this->newLineTransformer = $newLineTransformer;
    }

    /**
     * Validates messages and adds message to database, checks if there are new messages from last refresh,
     * save sent message's id to session as lastid
     *
     * @param User $user User instance, who is sending message
     * @param string $text Message's text
     *
     * @param int $channel
     *
     * @return array status of adding messages, and new messages from last refresh
     * @throws \Exception
     */
    public function addMessageToDatabase(User $user, string $text, int $channel): array
    {
        if ($this->validateMessage($user, $text, $channel) === false) {
            return $this->returnFail();
        }

        if ($this->userAfkValidator->validateUserAfk($text)) {
            $this->specialMessageAddTransformer->specialMessagesAdd('/afk', $user, $channel);
        }

        $specialMessages = $this->specialMessageAddTransformer->specialMessagesAdd($text, $user, $channel);
        if ($specialMessages !== null) {
            return $specialMessages ? $this->returnSuccess() : $this->returnFail();
        }

        $this->addMessageToDatabase->addMessage(
            $this->newLineTransformer->transformLine(htmlentities($text)),
            $channel,
            $user
        );

        return $this->returnSuccess();
    }

    private function returnFail(): array
    {
        return [
            'status' => 'false',
            'errorMessage' => $this->session->get('errorMessage')
        ];
    }

    private function returnSuccess(): array
    {
        return [
            'status' => 'true',
        ];
    }

    private function validateMessage(User $user, ?string $text, int $channel): bool
    {
        return $this->addMessageValidator->validateMessage($user, $channel, $text);
    }
}
