<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Service;
use App\Models\Booth;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booth_services', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Booth::class);
            $table->foreignIdFor(Service::class);
            $table->timestamps();

            $table->foreign('booth_id')->references('id')->on('booths')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booth_services');
    }
};
