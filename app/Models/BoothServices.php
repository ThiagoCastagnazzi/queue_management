<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoothServices extends Model
{
    /** @use HasFactory<\Database\Factories\BoothServicesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'booth_id',
        'service_id',
    ];

    public function booth()
    {
        return $this->belongsTo(Booth::class, 'booth_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
