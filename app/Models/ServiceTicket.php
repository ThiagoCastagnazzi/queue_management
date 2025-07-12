<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceTicket extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_id',
        'service_id',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
