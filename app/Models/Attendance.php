<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    /** @use HasFactory<\Database\Factories\AttendanceFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'ticket_id',
        'booth_id',
        'service_id',
        'start_time',
        'finish_time',
        'status',
        'rating',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function booth()
    {
        return $this->belongsTo(Booth::class);
    }

    public function notes()
    {
        return $this->hasMany(AttendanceNotes::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
