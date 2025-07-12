<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Ticket;
use App\Models\Totem;
use App\Http\Requests\StoreTotemRequest;
use App\Http\Requests\UpdateTotemRequest;
use Inertia\Inertia;

class TotemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('totems/index', [
            'totems' => Totem::with('services')->paginate(12),
            'services' => Service::select('id', 'name')->get()
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
    public function store(StoreTotemRequest $request)
    {
        $totem = Totem::create($request->validated());
        $totem->services()->sync($request->services);
        return redirect()->route('totems.index')->with('success', 'Totem criado com sucesso!');
    }
    /**
     * Display the specified resource.
     */
    public function show(Totem $totem)
    {
        return Inertia::render('totems/show', [
            'totem' => $totem->load('services')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTotemRequest $request, Totem $totem)
    {
        $totem->update($request->validated());
        $totem->services()->sync($request->services);
        return redirect()->route('totems.index')->with('success', 'Totem atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Totem $totem)
    {
        $totem->delete();
        return redirect()->route('totems.index')->with('success', 'Totem deletado com sucesso!');
    }
}
