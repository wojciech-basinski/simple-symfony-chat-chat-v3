<?php declare(strict_types = 1);

namespace App\Utils;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class AdminPanel
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * AdminPanel constructor.
     *
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Gets all user from database
     *
     * @return array Array of Users entities
     */
    public function getAllUsers(): array
    {
        return $this->em->getRepository('App:User')->findAll();
    }

    /**
     * Changes User role on chat
     *
     * @param int $id User's id
     *
     * @param string $role role that User will have after changing
     */
    public function changeUsersRole(int $id, string $role): void
    {
        /** @var User|null $user */
        $user = $this->em->getRepository('App:User')->find($id);
        if ($user === null) {
            return;
        }

        $user->changeRole($role);

        $this->em->persist($user);
        $this->em->flush();
    }
}
