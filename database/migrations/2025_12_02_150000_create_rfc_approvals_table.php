<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rfc_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rfc_id')->constrained('rfc')->onDelete('cascade');
            $table->foreignId('approver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('level', ['kasi', 'kabid', 'kadis'])->comment('Level approval: kasi, kabid, kadis');
            $table->enum('decision', ['approved', 'rejected', 'revise'])->comment('Keputusan: approved, rejected, revise (need_info)');
            $table->text('reason')->nullable()->comment('Catatan/alasan keputusan');
            $table->timestamp('decided_at')->nullable()->comment('Waktu keputusan dibuat');
            $table->timestamps();

            // Index untuk query performa
            $table->index('rfc_id');
            $table->index(['rfc_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rfc_approvals');
    }
};
