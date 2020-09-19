<?php declare(strict_types = 1);

namespace App\Controller;

use App\Utils\AdminPanel;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends Controller
{
    /**
     * @Route("/chat/admin/", name="chat_admin")
     *
     * Gets info about Users
     *
     * @param AdminPanel $adminPanel
     *
     * @return Response
     */
    public function adminAction(AdminPanel $adminPanel): Response
    {
        return $this->render('admin/index.html.twig', [
            'users' => $adminPanel->getAllUsers()
        ]);
    }

    /**
     * @Route("/chat/admin/change/{id}/{role}", name="chat_admin_change")
     *
     * Changes user's role
     *
     * @param int $id
     * @param string $role
     * @param AdminPanel $adminPanel
     *
     * @return Response
     */
    public function adminPromoteAction(int $id, string $role, AdminPanel $adminPanel): Response
    {
        $adminPanel->changeUsersRole($id, $role);

        return $this->redirectToRoute('chat_admin');
    }
}
