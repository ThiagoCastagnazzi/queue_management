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
                'name' => 'Atendente',
                'email' => 'atendente@email.com',
                'password' => bcrypt('atendente123'),
            ]);
            User::factory()->create([
                'name' => 'Médico',
                'email' => 'medico@email.com',
                'password' => bcrypt('medico123'),
            ]);
        } else {
            User::factory()->create([
                'name' => 'Thiago Castagnazzi',
                'email' => 'thiago@gmail.com',
                'password' => bcrypt('thiago123'),
            ]);
        }
    }
}
