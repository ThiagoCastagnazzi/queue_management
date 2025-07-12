<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Booth;
use App\Models\Attendance;
use App\Models\Ticket;

class ValidateManagerAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        $booth = Booth::with(['services'])->where('user_id', $user->id)->first();

        if (!$booth) {
            return redirect()->route('booths.index')->with('error', 'Você não está associado a uma guichê.');
        }

        $attendance = Attendance::where('booth_id', $booth->id)->where('status', 'pending')->first();
        if ($attendance) {
            return redirect()->route('attendances.show', $attendance->id)->with('error', 'Você já está atendendo um cliente.');
        }

        $ticket = Ticket::where('booth_id', $booth->id)->where('status', 'called')->first();
        if ($ticket) {
            if($request->route()->getName() !== 'manager.edit') {
                return redirect()->route('manager.edit', $ticket->id)->with('error', 'Você já está chamando um cliente.');
            }
        }

        return $next($request);
    }
}
