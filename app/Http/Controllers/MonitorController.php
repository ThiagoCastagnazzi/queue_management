<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use App\Http\Requests\StoreMonitorRequest;
use App\Http\Requests\UpdateMonitorRequest;
use App\Models\Service;
use App\Models\ServiceTicket;
use Inertia\Inertia;

class MonitorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $monitors = Monitor::with('services')->paginate(12);
        $services = Service::all();
        return Inertia::render('monitors/index', [
            'monitors' => $monitors,
            'services' => $services,
        ]);
    }

    public function show(Monitor $monitor)
    {
        $services = $monitor->services;
        $tickets = ServiceTicket::with('ticket')
            ->whereIn('service_id', $services->pluck('id'))
            ->whereHas('ticket', function ($query) {
                $query->whereIn('status', ['called', 'solved', 'pending']);
                $query->whereNotNull('called_at');
            })
            ->take(12)
            ->get()
            ->pluck('ticket')
            ->sortByDesc('called_at')
            ->values();

        return Inertia::render('monitors/show', [
            'monitor' => $monitor,
            'tickets' => $tickets
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('monitors/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMonitorRequest $request)
    {
        $monitor = Monitor::create($request->validated());
        $monitor->services()->sync($request->services);
        return redirect()->route('monitors.index')->with('success', 'Monitor created.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Monitor $monitor)
    {
        return Inertia::render('monitors/edit', [
            'monitor' => $monitor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMonitorRequest $request, Monitor $monitor)
    {
        $monitor->update($request->validated());
        $monitor->services()->sync($request->services);
        return redirect()->route('monitors.index')->with('success', 'Monitor updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Monitor $monitor)
    {
        $monitor->delete();
        return redirect()->route('monitors.index')->with('success', 'Monitor deleted.');
    }
}
