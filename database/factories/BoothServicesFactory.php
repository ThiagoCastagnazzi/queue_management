<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\BoothServices;
use App\Models\Booth;
use App\Models\Service;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BoothServices>
 */
class BoothServicesFactory extends Factory
{
    protected $model = BoothServices::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booth_id' => Booth::factory(),
            'service_id' => Service::factory(),
        ];
    }
}
