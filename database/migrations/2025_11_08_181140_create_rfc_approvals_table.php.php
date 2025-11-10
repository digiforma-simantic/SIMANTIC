<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rfc_approvals', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('rfc_id')
                ->constrained('rfc');

            $table->enum('level', ['kasi', 'kabid', 'kadis']);
            $table->foreignId('approver_id')
                ->constrained('users');

            $table->enum('decision', ['approve', 'reject', 'revise'])->nullable();
            $table->text('reason')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();

            $table->unique(['rfc_id', 'level']); // 1 level 1 keputusan
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rfc_approvals');
    }
};
