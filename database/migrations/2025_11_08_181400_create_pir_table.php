<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pir', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('rfc_id')
                ->unique()
                ->constrained('rfc');

            $table->text('summary')->nullable();
            $table->text('root_cause')->nullable();
            $table->text('residual_risk')->nullable();
            $table->text('corrective_action')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pir');
    }
};
