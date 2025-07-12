<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\MonitorServices;
use App\Models\Monitor;
use App\Models\Service;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MonitorServices>
 */
class MonitorServicesFactory extends Factory
{
    protected $model = MonitorServices::class;
    
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'monitor_id' => Monitor::factory(),
            'service_id' => Service::factory(),
        ];
    }
}
