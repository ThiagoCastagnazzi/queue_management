<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\TicketServices;
use App\Models\Ticket;
use App\Models\Service;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketServices>
 */
class TicketServicesFactory extends Factory
{
    protected $model = TicketServices::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_id' => Ticket::factory(),
            'service_id' => Service::factory(),
        ];
    }
}
