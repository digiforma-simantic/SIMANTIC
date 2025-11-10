<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rfc_assessments', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('rfc_id')
                ->unique()
                ->constrained('rfc');

            $table->boolean('completeness_ok')->default(false);
            $table->enum('suggested_change_type', ['minor', 'major', 'emergency'])->nullable();
            $table->integer('risk_auto_score')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rfc_assessments');
    }
};
