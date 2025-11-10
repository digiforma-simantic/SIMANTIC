<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('impact_reports', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('rfc_id')
                ->unique()
                ->constrained('rfc');

            $table->enum('severity', ['low', 'medium', 'high', 'critical']);
            $table->json('affected_relations')->nullable();
            $table->boolean('lock_required')->default(false);
            $table->timestamps(); // created_at (sesuai PDM) + updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('impact_reports');
    }
};
