<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booth extends Model
{
    /** @use HasFactory<\Database\Factories\BoothFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'number',
        'user_id',
        'active',
    ];

    public function services()
    {
        return $this->belongsToMany(Service::class, 'booth_services', 'booth_id', 'service_id');
    }

    public function monitors()
    {
        return $this->hasOne(Monitor::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
