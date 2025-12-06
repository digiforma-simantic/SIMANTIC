<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ci_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_ci_id')
                ->constrained('configuration_items')
                ->restrictOnDelete();

            $table->foreignId('target_ci_id')
                ->constrained('configuration_items')
                ->restrictOnDelete();

            $table->string('relation_type', 50); // depends_on, connected_to, replicated_to
            $table->timestamps();

            $table->index(['source_ci_id', 'target_ci_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ci_relations');
    }
};
