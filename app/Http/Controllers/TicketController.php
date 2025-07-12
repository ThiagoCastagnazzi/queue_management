<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use Illuminate\Support\Facades\DB;
use App\Events\NewTicketEvent;
use App\Events\CallingTicketEvent;
use App\Events\CallingScreenEvent;
use App\Models\Ticket;
use App\Models\Booth;
use App\Models\Monitor;
use Inertia\Inertia;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets = Ticket::with('services')->latest()->paginate(12);
        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('tickets/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        DB::beginTransaction();
        try {
            $ticket = Ticket::create($request->validated());
            $ticket->services()->attach($request->service_id);
            $ticket->serviceTickets()->create(['service_id' => $request->service_id]);
            $ticket->update(['code' => $ticket->generateCode($request->service_id)]);
            $services = $ticket->services()->pluck('services.id')->toArray();

            $booths = Booth::whereHas('services', function ($query) use ($services) {
                $query->whereIn('services.id', $services);
            })->get();

            foreach ($booths as $booth) {
                event(new NewTicketEvent($booth, $ticket));
            }

            DB::commit();

            $ticket->url = route('screen', $ticket->uuid);

            return response()->json($ticket, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        return Inertia::render('tickets/edit', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        DB::beginTransaction();
        try {
            $ticket->update($request->validated());
            $ticket->services()->sync($request->services);

            foreach ($request->services as $service_id) {
                $ticket->serviceTickets()->updateOrCreate(['service_id' => $service_id]);
            }

            $services = $ticket->services()->pluck('services.id')->toArray();

            if ($ticket->status === 'called') {
                $ticket->update(['called_at' => now()]);

                $monitors = Monitor::whereHas('services', function ($query) use ($ticket) {
                    $query->whereIn('services.id', $ticket->services->pluck('id'));
                })->get();

                foreach ($monitors as $monitor) {
                    event(new CallingTicketEvent($ticket, $monitor));
                }
            }

            $booths = Booth::whereHas('services', function ($query) use ($services) {
                $query->whereIn('services.id', $services);
            })->get();

            foreach ($booths as $booth) {
                event(new NewTicketEvent($booth, $ticket));
            }

            event(new CallingScreenEvent($ticket));

            DB::commit();

            return redirect()->route('manager.edit', $ticket->id)->with('success', 'Ticket updated.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        DB::beginTransaction();
        try {
            $services = $ticket->services()->pluck('services.id')->toArray();

            $booths = Booth::whereHas('services', function ($query) use ($services) {
                $query->whereIn('services.id', $services);
            })->get();

            foreach ($booths as $booth) {
                event(new NewTicketEvent($booth, $ticket));
            }

            $ticket->update(['status' => 'cancelled']);

            event(new CallingScreenEvent($ticket));

            DB::commit();
            return redirect()->route('manager.index')->with('success', 'Ticket deleted.');
        } catch (\Exception $e) {
            logger($e);
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }
}
