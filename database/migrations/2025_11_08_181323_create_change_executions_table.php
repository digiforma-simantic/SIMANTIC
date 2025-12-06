<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('change_executions', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('rfc_id')
                ->constrained('rfc');

            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->enum('result', ['success', 'failed'])->nullable();
            $table->string('log_url', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('change_executions');
    }
};
