<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rfc', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->enum('category', ['normal', 'standard', 'emergency']);
            $table->enum('urgency', ['low', 'medium', 'high', 'critical']);
            $table->enum('priority', ['P4', 'P3', 'P2', 'P1']);

            $table->enum('status', [
                'submitted',
                'under_review',
                'approval_pending',
                'approved',
                'planning',
                'implementing',
                'completed',
                'failed',
                'pir',
                'compliance',
                'closed',
            ])->default('submitted');

            $table->foreignId('requester_id')
                ->constrained('users');

            $table->foreignId('requester_opd_id')
                ->constrained('opd');

            $table->timestamps();

            $table->index('status');
            $table->index('category');
            $table->index('priority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rfc');
    }
};
