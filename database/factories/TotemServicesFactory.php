<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\TotemServices;
use App\Models\Totem;
use App\Models\Service;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TotemServices>
 */
class TotemServicesFactory extends Factory
{
    protected $model = TotemServices::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'totem_id' => Totem::factory(),
            'service_id' => Service::factory(),
        ];
    }
}
