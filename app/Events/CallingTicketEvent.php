<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\ServiceTicket;
use App\Models\Monitor;
use App\Models\Ticket;

class CallingTicketEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Ticket $ticket;
    public Monitor $monitor;

    /**
     * Create a new event instance.
     */
    public function __construct(Ticket $ticket, Monitor $monitor)
    {
        $this->ticket = $ticket;
        $this->monitor = $monitor;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Properly using the Log facade to log information
        return [
            new Channel('Monitor.' . $this->monitor->id),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastAs(): string
    {
        return 'Monitor';
    }

    public function broadcastWith(): array
    {
        $tickets = ServiceTicket::with('ticket')
            ->whereIn('service_id', $this->monitor->services->pluck('id'))
            ->whereHas('ticket', function ($query) {
                $query->whereIn('status', ['called', 'solved', 'pending']);
                $query->whereNotNull('called_at');
            })
            ->take(12)
            ->get()
            ->pluck('ticket')
            ->sortByDesc('called_at')
            ->values();

        return [
            'ticket' => $this->ticket,
            'tickets' => $tickets
        ];
    }
}
