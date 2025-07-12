<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Booth;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('code')->nullable();
            $table->boolean('is_preferential')->default(false);
            $table->foreignIdFor(Booth::class)->nullable();
            $table->enum('status', ['pending', 'called', 'attended', 'cancelled', 'solved'])->default('pending');
            $table->enum('priority' , ['low', 'medium', 'high'])->default('medium');
            $table->string('audio')->nullable();

            $table->timestamp('called_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
