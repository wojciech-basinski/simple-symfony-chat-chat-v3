<?php declare(strict_types = 1);

namespace App\Utils\Messages\SpecialMessages\Create;

use App\Entity\User;
use App\Utils\Cache\GetBotUserFromCache;
use App\Utils\ChatConfig;
use App\Utils\Messages\Database\AddMessageToDatabase;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Translation\TranslatorInterface;

class RollMessageCreate implements SpecialMessageAdd
{
    private SessionInterface $session;

    private ChatConfig $config;

    private AddMessageToDatabase $addMessageToDatabase;

    public function __construct(
        SessionInterface $session,
        ChatConfig $config,
        AddMessageToDatabase $addMessageToDatabase
    ) {
        $this->session = $session;
        $this->config = $config;
        $this->addMessageToDatabase = $addMessageToDatabase;
    }

    public function canAdd(string $text): bool
    {
        return $text === '/roll';
    }

    public function add(array $text, User $user, int $channel): bool
    {
        if ($this->config->getRollCoolDown() && !$this->checkRollCoolDown()) {
            return false;
        }

        $this->addMessageToDatabase->addBotMessage(
            $this->createRollText($text, $user),
            $channel
        );
        return true;
    }

    private function createRollText(array $text, User $user): string
    {
        $dice = $this->createDice($text);

        $text = "/roll {$dice[0]}d{$dice[1]} {$user->getUsername()} ";
        for ($i = 0; $i < $dice[0]; $i++) {
            $result = $this->rollDice((int) $dice[1]);
            $text .= $result . ', ';
        }

        return \rtrim($text, ', ') . '.';
    }

    /**
     * @param int $max
     *
     * @return int
     * @throws \Exception
     */
    private function rollDice(int $max): int
    {
        return \random_int(1, $max);
    }

    private function checkRollCoolDown(): bool
    {
        $time = \time();
        $rollTime = $this->session->get('rollTime', $time);
        if ($rollTime > $time) {
            $this->session->set(
                'errorMessage',
                'Nie możesz użyć kostki jeszcze przez ' . ($rollTime -$time) . ' sekund'
            );
            return false;
        }
        $this->session->set('rollTime', $time + $this->config->getRollCoolDown());
        return true;
    }

    private function createDice(array $text): array
    {
        if (!isset($text[1])) {
            return [0 => 2, 1 => 6];
        }

        $dice = \explode('d', $text[1]);

        if (\count($dice) < 2) {
            return [0 => 2, 1 => 6];
        }
        if (!\is_numeric($dice[0]) || $dice[0] <= 0 || $dice[0] > 100) {
            $dice[0] = 2;
        }
        if (!\is_numeric($dice[1]) || $dice[1] <= 0 || $dice[1] > 100) {
            $dice[1] = 6;
        }
        return $dice;
    }
}
