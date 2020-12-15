<?php declare(strict_types = 1);

namespace App\Utils\Cache;

use App\Entity\User;
use App\Utils\ChatConfig;
use Doctrine\ORM\EntityManagerInterface;
use \RuntimeException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Cache\Simple\FilesystemCache;

class GetBotUserFromCache
{
    private FilesystemCache $cache;

    private ChatConfig $config;

    private EntityManagerInterface $em;

    private LoggerInterface $logger;

    public function __construct(
        FilesystemCache $cache,
        ChatConfig $config,
        EntityManagerInterface $em,
        LoggerInterface $logger
    ) {
        $this->cache = $cache;
        $this->config = $config;
        $this->em = $em;
        $this->logger = $logger;
    }

    public function getChatBotUser(): User
    {
        $botFromCache = $this->cache->get('botUser');
        if ($botFromCache instanceof User) {
            $this->logger->debug('load bot user from cache');
            return $botFromCache;
        }

        $bot = $this->em->find(User::class, $this->config->getBotId());
        if (!$bot instanceof User) {
            throw new RuntimeException('Could not find bot user');
        }
        $this->logger->info('set bot to cache');
        $this->cache->set('botUser', $bot, 86400);//one day
        return $bot;
    }
}
