<?php declare(strict_types = 1);

namespace App\Utils\Messages;

use App\Entity\User;
use App\Utils\EmitMessage\EmitNewMessage;
use App\Utils\Messages\Database\AddMessageToDatabase;
use App\Utils\Messages\Transformers\NewLineTransformer;
use App\Utils\Messages\Transformers\SpecialMessageAddTransformer;
use App\Utils\Messages\Validator\AddMessageValidator;
use App\Utils\Messages\Validator\UserAfkValidator;
use Symfony\Component\HttpFoundation\JsonResponse;
use function htmlentities;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class AddMessage
{
    private AddMessageValidator $addMessageValidator;

    private SessionInterface $session;

    private UserAfkValidator $userAfkValidator;

    private SpecialMessageAddTransformer $specialMessageAddTransformer;

    private AddMessageToDatabase $addMessageToDatabase;

    private NewLineTransformer $newLineTransformer;

    private EmitNewMessage $emitNewMessage;

    public function __construct(
        AddMessageValidator $addMessageValidator,
        SessionInterface $session,
        UserAfkValidator $userAfkValidator,
        SpecialMessageAddTransformer $specialMessageAddTransformer,
        AddMessageToDatabase $addMessageToDatabase,
        NewLineTransformer $newLineTransformer,
        EmitNewMessage $emitNewMessage
    ) {
        $this->addMessageValidator = $addMessageValidator;
        $this->session = $session;
        $this->userAfkValidator = $userAfkValidator;
        $this->specialMessageAddTransformer = $specialMessageAddTransformer;
        $this->addMessageToDatabase = $addMessageToDatabase;
        $this->newLineTransformer = $newLineTransformer;
        $this->emitNewMessage = $emitNewMessage;
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
     * @return JsonResponse
     * @throws \Exception
     */
    public function addMessageToDatabase(User $user, ?string $text, ?int $channel): JsonResponse
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

    private function returnFail(): JsonResponse
    {
        return (new JsonResponse())
            ->setContent(json_encode([
                'errorMessage' => $this->session->get('errorMessage')
            ]))
            ->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
    }

    private function returnSuccess(): JsonResponse
    {
        return (new JsonResponse())
            ->setStatusCode(JsonResponse::HTTP_OK);
    }

    private function validateMessage(User $user, ?string $text, ?int $channel): bool
    {
        if ($channel === null) {
            $this->session->set('errorMessage', 'Brak podanego kanału');
            return false;
        }
        return $this->addMessageValidator->validateMessage($user, $channel, $text);
    }
}
