<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Ticket extends Model
{
    /** @use HasFactory<\Database\Factories\TicketFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'is_preferential',
        'booth_id',
        'status',
        'audio',
        'priority',
        'called_at',
        'uuid',
    ];

    protected $casts = [
        'called_at' => 'datetime',
    ];

    protected $with = ['services', 'booth'];

    public function services()
    {
        return $this->belongsToMany(Service::class, 'ticket_services', 'ticket_id', 'service_id');
    }

    public function booth()
    {
        return $this->belongsTo(Booth::class);
    }

    public function serviceTickets()
    {
        return $this->hasMany(ServiceTicket::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ticket) {
            $ticket->uuid = (string) Str::uuid();
        });
    }

    public function generateCode($service_id): string
    {
        // Pega o primeiro serviço relacionado ao ticket
        $service = Service::find($service_id);
        $prefix = $service->prefix;

        // Pega o id do último ticket cadastrado com o mesmo serviço no mesmo dia (count)
        $count = ServiceTicket::join('tickets', 'service_tickets.ticket_id', '=', 'tickets.id')
            ->where('tickets.id', '!=', $this->id)
            ->where('service_id', $service_id)
            ->whereDate('tickets.created_at', date('Y-m-d'))
            ->count();

        // Se o count for maior que 9999, reinicia o contador
        if ($count > 9999) {
            $count = $count - 9999;
        } else {
            $count = $count + 1;
        }

        // Retorna o código do ticket
        return strtoupper($prefix) . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
