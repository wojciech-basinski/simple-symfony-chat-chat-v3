<?php declare(strict_types = 1);

namespace App\Controller;

use App\Entity\User;
use App\Utils\ChatConfig;
use App\Utils\UserOnline;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends Controller
{
    /**
     * @Route("/add/", name="add_online")
     *
     * Adds info about user to users online in database.
     *
     * @param UserOnline $userOnline
     *
     * @param SessionInterface $session
     *
     * @return Response
     * @throws \Exception
     */
    public function addOnlineUserAction(UserOnline $userOnline, SessionInterface $session): Response
    {
        $user = $this->getUser();
        $session->set('channel', 1);
        if ($userOnline->addUserOnline($user, 1)) {
            return $this->redirectToRoute('banned');
        }

        return $this->redirectToRoute('chat_index');
    }
}
