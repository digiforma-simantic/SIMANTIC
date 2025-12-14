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
            $table->foreignId('approver_id')->nullable();
            $table->enum('level', ['kepala_seksi', 'kepala_bidang', 'kepala_dinas', 'admin_dinas'])->comment('Level approval sesuai alur berjenjang OPD');
            $table->enum('decision', ['approved', 'rejected', 'revise', 'pending'])->nullable()->comment('Keputusan: approved, rejected, revise, pending (null jika masih belum ada keputusan)');
            $table->text('reason')->nullable()->comment('Catatan/alasan keputusan');
            $table->timestamp('approved_at')->nullable()->comment('Waktu keputusan dibuat');
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
