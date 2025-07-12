<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonitorServices extends Model
{
    /** @use HasFactory<\Database\Factories\MonitorServicesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'monitor_id',
        'service_id',
    ];

    public function monitor()
    {
        return $this->belongsTo(Monitor::class, 'monitor_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
