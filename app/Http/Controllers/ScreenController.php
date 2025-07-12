<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ScreenController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            $ticket = Ticket::with(['services'])->where('uuid', $request->uuid)->firstOrFail();
            return Inertia::render('tickets/show', [
                'ticket' => $ticket,
            ]);
        } catch (\Exception $e) {
            abort(404);
        }
    }
}
