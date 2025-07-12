<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Booth;
use App\Models\Service;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Ticket::class);
            $table->foreignIdFor(Booth::class);
            $table->foreignIdFor(Service::class);
            $table->dateTime('start_time');
            $table->dateTime('finish_time')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'finished', 'cancelled'])->default('pending');
            $table->integer('rating')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
