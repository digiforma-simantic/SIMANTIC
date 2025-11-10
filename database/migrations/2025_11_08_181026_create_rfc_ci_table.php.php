<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rfc_ci', function (Blueprint $table) {
            $table->foreignId('rfc_id')
                ->constrained('rfc');

            $table->foreignId('ci_id')
                ->constrained('configuration_items');

            $table->primary(['rfc_id', 'ci_id']); // PK gabungan
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rfc_ci');
    }
};
