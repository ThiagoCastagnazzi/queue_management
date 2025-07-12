<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Attendance;
use App\Models\AttendanceNotes;
use App\Models\BoothServices;
use App\Models\Monitor;
use App\Models\Service;
use App\Models\TotemServices;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (config('app.env') === 'local') {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

            Service::factory(10)->create();
            Monitor::factory(10)->create();
            BoothServices::factory(10)->create();
            Attendance::factory(10)->create();
            AttendanceNotes::factory(10)->create();
            TotemServices::factory(10)->create();
        } else {
            User::factory()->create([
                'name' => 'Thiago Castagnazzi',
                'email' => 'thiago@gmail.com',
                'password' => bcrypt('thiago'),
            ]);
        }
    }
}
