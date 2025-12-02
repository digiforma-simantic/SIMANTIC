<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuration_items', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->string('name', 255);
            $table->string('type', 100);
            $table->foreignId('owner_opd_id')->constrained('dinas');
            $table->enum('environment', ['production', 'staging', 'development']);
            $table->enum('criticality', ['low', 'medium', 'high', 'critical']);
            $table->enum('status', ['active', 'under_change', 'retired', 'maintenance']);
            $table->string('version', 50)->nullable();
            $table->string('patch_level', 50)->nullable();
            $table->integer('risk_level')->default(0);
            $table->timestamps();

            $table->index(['owner_opd_id']);
            $table->index(['type']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuration_items');
    }
};
