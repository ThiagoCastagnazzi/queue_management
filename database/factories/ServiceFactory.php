<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Service;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'prefix' => $this->faker->lexify('???'),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'preferential' => $this->faker->boolean,
            'active' => $this->faker->boolean(90),
        ];
    }
}
