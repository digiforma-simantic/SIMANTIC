<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hindari error "table already exists"
        if (!Schema::hasTable('ci_relations')) {
            Schema::create('ci_relations', function (Blueprint $table) {
                // Primary key auto increment
                $table->id(); // bigint unsigned auto_increment

                // Relasi antar CI (konfigurasi item)
                $table->unsignedBigInteger('source_ci_id');
                $table->unsignedBigInteger('target_ci_id');

                // Hubungan antar CI: runs_on, depends_on, connected_to, dsb.
                $table->string('relation_type', 50)->index();

                $table->timestamps();

                // Unique agar tidak ada duplikat relasi yang sama
                $table->unique(
                    ['source_ci_id', 'target_ci_id', 'relation_type'],
                    'ci_relations_unique'
                );

                // Foreign Key dengan cascade delete
                $table->foreign('source_ci_id')
                      ->references('id')
                      ->on('configuration_items')
                      ->cascadeOnDelete();

                $table->foreign('target_ci_id')
                      ->references('id')
                      ->on('configuration_items')
                      ->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ci_relations');
    }
};
