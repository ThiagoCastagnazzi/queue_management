<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AttendanceNotes;
use App\Models\Attendance;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceNotes>
 */
class AttendanceNotesFactory extends Factory
{
    protected $model = AttendanceNotes::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'attendance_id' => Attendance::factory(),
            'user_id' => User::factory(),
            'text' => $this->faker->sentence,
        ];
    }
}
