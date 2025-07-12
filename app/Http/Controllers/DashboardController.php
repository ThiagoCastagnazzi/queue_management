<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Ticket;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $cancelledTickets = Ticket::where('status', 'cancelled')
            ->whereMonth('created_at', now()->month)
            ->count();

        $totalTickets = Ticket::whereMonth('created_at', now()->month)
            ->where('status', '!=', 'cancelled')
            ->count();

        $totalAttendees = Attendance::whereMonth('created_at', now()->month)
            ->count();

        $tickets = Ticket::whereMonth('created_at', now()->month)
            ->orderBy('called_at', 'desc')
            ->paginate(12);

        return Inertia::render('dashboard', [
            'cancelledTickets' => $cancelledTickets,
            'totalTickets' => $totalTickets,
            'totalAttendees' => $totalAttendees,
            'tickets' => $tickets,
        ]);
    }
}
