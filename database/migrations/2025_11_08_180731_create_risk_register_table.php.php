<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('risk_register', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('ci_id')
                ->constrained('configuration_items');

            $table->string('risk_category', 100);
            $table->integer('likelihood');   // 1–5
            $table->integer('impact');       // 1–5
            $table->integer('risk_score');   // likelihood × impact
            $table->string('treatment', 255);
            $table->timestamps();

            $table->index('ci_id');
            $table->index('risk_score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_register');
    }
};
