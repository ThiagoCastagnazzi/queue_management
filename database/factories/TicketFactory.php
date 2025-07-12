<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Ticket;
use App\Models\TicketServices;
use App\Models\Service;
use App\Models\Booth;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'is_preferential' => $this->faker->boolean,
            'booth_id' => Booth::factory(),
            'status' => $this->faker->randomElement(['pending', 'called', 'attended', 'cancelled', 'solved']),
            'audio' => $this->faker->optional()->word,
        ];
    }

    /**
     * Indicate that the ticket has a service.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function configure()
    {
        return $this->afterCreating(function (Ticket $ticket) {
           $ticket_service = TicketServices::factory()->create([
                'ticket_id' => $ticket->id,
                'service_id' => Service::factory(),
            ]);

            $ticket->update([
                'code' => $ticket->generateCode($ticket_service->service_id),
            ]);
        });
    }
}
