<?php declare(strict_types = 1);

namespace App\Controller;

use App\Utils\Banned;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BannedController extends Controller
{
    /**
     * @Route("/banned", name="banned")
     * @param Banned $banned
     *
     * @return Response
     * @throws \Exception
     */
    public function bannedAction(Banned $banned): Response
    {
        if ($this->getUser() === null) {
            return $this->redirectToRoute('chat_index');
        }
        $userName = $this->getUser()->getUsername();
        $reason = $banned->getReason($userName);
        $time = $banned->getTime($userName);
        if ($time === null) {
            return $this->redirectToRoute('chat_index');
        }
        if ($time <= new \DateTime('now')) {
            $banned->removeBan($userName);
            $this->addFlash('success', 'Ban został zdjęty, zaloguj się ponownie');
            return $this->render('chat/banned.html.twig');
        }
        $timeFormatted = $time->format('Y-m-d H:i:s');
        $this->addFlash('error', "Ban do: $timeFormatted<br /> powód: $reason");
        return $this->render('chat/banned.html.twig');
    }
}
