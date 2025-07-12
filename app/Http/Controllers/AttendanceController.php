<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use Illuminate\Support\Facades\Auth;
use App\Events\CallingScreenEvent;
use App\Models\Service;
use App\Models\Ticket;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendance = Attendance::with(['ticket', 'service', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(12);
        return Inertia::render('attendances/index', [
            'attendances' => $attendance
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('attendances/create');
    }

    public function show(Attendance $attendance)
    {
        $user = Auth::user();
        $attendance = Attendance::with(['ticket'])
            ->where('status', 'pending')
            ->where('booth_id', $user->booth->id)
            ->firstOrFail();

        return Inertia::render('attendances/show', [
            'attendance' => $attendance
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $ticket = Ticket::findOrFail($request->ticket_id);
        $ticket->services()->detach($request->service_id);
        $attendance = Attendance::create($request->validated());

        $ticket->update(['status' => 'attended']);

        event(new CallingScreenEvent($ticket));

        return redirect()->route('attendances.show', $attendance->id)->with('success', 'Attendance created.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        $services = Service::all();
        return Inertia::render('attendances/edit', [
            'attendance' => $attendance,
            'services' => $services
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        $attendance->update($request->validated());

        if ($request->text) {
            $attendance->notes()->create([
                'user_id' => $attendance->user_id,
                'text' => $request->text
            ]);
        }

        $ticket = Ticket::findOrFail($attendance->ticket_id);

        if ($ticket->services()->count() > 0) {
            $ticket->update(['status' => 'pending']);
        } else {
            $ticket->update(['status' => 'solved']);
        }

        event(new CallingScreenEvent($ticket));

        return redirect()->route('manager.index')->with('success', 'Attendance updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->route('attendances.index')->with('success', 'Attendance deleted.');
    }
}
