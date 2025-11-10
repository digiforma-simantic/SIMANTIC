<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_logs', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('ci_id')
                ->constrained('configuration_items');

            $table->string('activity', 150);
            $table->enum('result', ['success', 'partial', 'failed']);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->foreignId('technician_id')
                ->constrained('users');

            $table->foreignId('ref_rfc_id')
                ->nullable()
                ->constrained('rfc'); // akan ada setelah tabel rfc dibuat

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_logs');
    }
};
