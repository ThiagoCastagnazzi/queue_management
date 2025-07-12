<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Totem extends Model
{
    /** @use HasFactory<\Database\Factories\TotemFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
    ];

    public function services()
    {
        return $this->belongsToMany(Service::class, 'totem_services', 'totem_id', 'service_id');
    }
}
