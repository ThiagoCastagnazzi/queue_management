<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TotemServices extends Model
{
    /** @use HasFactory<\Database\Factories\TotemServicesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'totem_id',
        'service_id',
    ];

    public function totem()
    {
        return $this->belongsTo(Totem::class, 'totem_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
