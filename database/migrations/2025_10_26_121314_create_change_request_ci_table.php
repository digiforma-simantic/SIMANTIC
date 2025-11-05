<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('change_request_ci', function (Blueprint $t) {
            $t->id(); // BIGINT UNSIGNED AUTO_INCREMENT

            // FK → change_requests.id (BIGINT UNSIGNED) + index otomatis
            $t->foreignId('change_id')
              ->constrained('change_requests')
              ->cascadeOnDelete();

            // FK → configuration_items.id (BIGINT UNSIGNED) + index otomatis
            $t->foreignId('ci_id')
              ->constrained('configuration_items')
              ->cascadeOnDelete();

            // dampak pada CI di change ini
            $t->enum('impact_level', ['low','med','high'])->default('med');

            $t->timestamps();

            // hindari duplikasi CI di change yang sama
            $t->unique(['change_id','ci_id'], 'uniq_change_ci');

            // bantu query per-CI (misal cek konflik)
            $t->index(['ci_id','change_id'], 'idx_ci_change');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('change_request_ci');
    }
};
