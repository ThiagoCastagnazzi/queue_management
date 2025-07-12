<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Ticket;
use App\Models\Booth;
use App\Models\Service;
use Inertia\Inertia;

class ManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $booth = Booth::with(['services'])->where('user_id', $user->id)->first();

        $tickets = [];

        if ($booth) {
            $tickets = Ticket::where('status', 'pending')
                ->whereHas('services', function ($query) use ($booth) {
                    $query->whereIn('services.id', $booth->services->pluck('id'));
                })
                ->orderBy('updated_at', 'asc')
                ->paginate(12);
        }

        $cancelledTickets = Ticket::where('status', 'cancelled')
            ->whereHas('services', function ($query) use ($booth) {
                $query->whereIn('services.id', $booth->services->pluck('id'));
            })
            ->whereDay('created_at', now()->day)
            ->count();

        $totalTickets = Ticket::whereDay('created_at', now()->day)
            ->whereHas('services', function ($query) use ($booth) {
                $query->whereIn('services.id', $booth->services->pluck('id'));
            })
            ->count();

        $totalAttendees = Attendance::whereMonth('created_at', now()->month)
            ->where('booth_id', $booth->id)
            ->count();

        return Inertia::render('manager/index', [
            'tickets' => $tickets,
            'booth' => $booth,
            'cancelledTickets' => $cancelledTickets,
            'totalTickets' => $totalTickets,
            'totalAttendees' => $totalAttendees,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($ticket_id)
    {
        $user = Auth::user();
        $ticket = Ticket::where('status', 'called')->where('booth_id', $user->booth->id)->findOrFail($ticket_id);
        $booth = Booth::with(['services'])->where('user_id', $user->id)->first();

        return Inertia::render('manager/edit', [
            'ticket' => $ticket,
            'services' => Service::select('id', 'name')->get(),
            'booth' => $booth,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }
}
