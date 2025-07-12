<?php

namespace App\Http\Controllers;

use App\Models\AttendanceNotes;
use App\Http\Requests\StoreAttendanceNotesRequest;
use App\Http\Requests\UpdateAttendanceNotesRequest;
use Inertia\Inertia;

class AttendanceNotesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('attendance-notes/index', [
            'attendanceNotes' => AttendanceNotes::paginate(12),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('attendance-notes/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceNotesRequest $request)
    {
        AttendanceNotes::create($request->validated());
        return redirect()->route('attendance-notes.index')->with('success', 'Attendance notes created.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttendanceNotes $attendanceNotes)
    {
        return Inertia::render('attendance-notes/edit', [
            'attendanceNotes' => $attendanceNotes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceNotesRequest $request, AttendanceNotes $attendanceNotes)
    {
        $attendanceNotes->update($request->validated());
        return redirect()->route('attendance-notes.index')->with('success', 'Attendance notes updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceNotes $attendanceNotes)
    {
        $attendanceNotes->delete();
        return redirect()->route('attendance-notes.index')->with('success', 'Attendance notes deleted.');
    }
}
