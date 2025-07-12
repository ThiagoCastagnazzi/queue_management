<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Service;
use App\Models\Totem;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('totem_services', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Service::class);
            $table->foreignIdFor(Totem::class);
            $table->timestamps();

            $table->foreign('totem_id')->references('id')->on('totems')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('totem_services');
    }
};
