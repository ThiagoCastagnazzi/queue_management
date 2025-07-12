<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreForwardRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Events\CallingScreenEvent;
use App\Models\Ticket;
use App\Models\Booth;
use App\Models\Attendance;
use App\Events\NewTicketEvent;

class ForwardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreForwardRequest $request)
    {
        $user = Auth::user();
        $ticket = Ticket::findOrFail($request->ticket_id);

        DB::beginTransaction();

        try {
            $ticket->services()->sync($request->services);
            $ticket->update(['status' => 'pending', 'booth_id' => null]);
            $services = $ticket->services()->pluck('services.id')->toArray();

            $booths = Booth::whereHas('services', function ($query) use ($services) {
                $query->whereIn('services.id', $services);
            })->get();

            Attendance::create([
                'user_id' => $user->id,
                'ticket_id' => $ticket->id,
                'booth_id' => $booths->first()->id,
                'service_id' => $ticket->services->first()->id,
                'start_time' => $ticket->created_at,
                'finish_time' => now(),
                'status' => 'finished'
            ]);

            event(new CallingScreenEvent($ticket));

            foreach ($booths as $booth) {
                event(new NewTicketEvent($booth, $ticket));
            }

            DB::commit();

            return redirect()->route('manager.index')->with('success', 'Ticket forwarded.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('manager.index')->with('error', $e->getMessage());
        }
    }
}
