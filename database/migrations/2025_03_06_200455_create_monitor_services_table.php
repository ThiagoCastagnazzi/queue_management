<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Monitor;
use App\Models\Service;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('monitor_services', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Monitor::class);
            $table->foreignIdFor(Service::class);

            $table->timestamps();

            $table->foreign('monitor_id')->references('id')->on('monitors')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monitor_services');
    }
};
