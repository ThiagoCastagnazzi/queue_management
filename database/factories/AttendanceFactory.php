<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Booth;
use App\Models\Service;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'ticket_id' => Ticket::factory(),
            'booth_id' => Booth::factory(),
            'service_id' => Service::factory(),
            'start_time' => $this->faker->dateTime,
            'finish_time' => $this->faker->optional()->dateTime,
            'status' => $this->faker->randomElement(['pending', 'in_progress', 'finished', 'cancelled']),
            'rating' => $this->faker->optional()->numberBetween(1, 5),
        ];
    }
}
