<?php

namespace App\Http\Controllers;

use App\Models\Booth;
use App\Http\Requests\StoreBoothRequest;
use App\Http\Requests\UpdateBoothRequest;
use App\Models\Service;
use App\Models\User;
use Inertia\Inertia;

class BoothController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('booths/index', [
            'booths' => Booth::with('services')
                ->orderBy('id', 'desc')
                ->paginate(12),
            'users' => User::select('id', 'name')->get(),
            'services' => Service::select('id', 'name')->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('booths/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBoothRequest $request)
    {
        $booth = Booth::create($request->validated());
        $booth->services()->sync($request->services);
        return redirect()->route('booths.index')->with('success', 'Booth created.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booth $booth)
    {
        return Inertia::render('booths/edit', [
            'booth' => $booth,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBoothRequest $request, Booth $booth)
    {
        $booth->update($request->validated());
        $booth->services()->sync($request->services);
        return redirect()->route('booths.index')->with('success', 'Booth updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booth $booth)
    {
        $booth->delete();
        return redirect()->route('booths.index')->with('success', 'Booth deleted.');
    }
}
