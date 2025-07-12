<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Booth;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booth>
 */
class BoothFactory extends Factory
{
    protected $model = Booth::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'number' => $this->faker->unique()->numberBetween(1, 100),
            'user_id' => User::factory(),
            'active' => $this->faker->boolean(90),
        ];
    }
}
