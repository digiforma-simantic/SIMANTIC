<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('change_plans', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('rfc_id')
                ->unique()
                ->constrained('rfc');

            $table->timestamp('window_start')->nullable();
            $table->timestamp('window_end')->nullable();
            $table->text('rollback_plan')->nullable();
            $table->text('mitigation_plan')->nullable();
            $table->string('assigned_team', 100)->nullable();

            $table->foreignId('assigned_technician_id')
                ->nullable()
                ->constrained('users');

            $table->json('locked_ci')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('change_plans');
    }
};
