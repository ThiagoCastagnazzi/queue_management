<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'prefix',
        'priority',
        'preferential',
        'active',
    ];

    public function tickets()
    {
        return $this->belongsToMany(Ticket::class, 'ticket_services', 'service_id', 'ticket_id');
    }

    public function monitorServices()
    {
        return $this->hasMany(MonitorServices::class);
    }

    public function booths()
    {
        return $this->belongsToMany(Booth::class, 'booth_services', 'service_id', 'booth_id');
    }

    public function serviceTickets()
    {
        return $this->hasMany(ServiceTicket::class);
    }
}
