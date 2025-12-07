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
        Schema::create('implementation_reports', function (Blueprint $table) {
            $table->id();
            $table->string('rfc_service_id')->nullable()->comment('ID RFC dari Service Desk');
            $table->unsignedBigInteger('rfc_id')->nullable()->comment('ID RFC internal (jika sudah tersinkron)');
            $table->enum('status', ['success', 'failed', 'partial'])->default('success');
            $table->text('description')->comment('Deskripsi hasil implementasi');
            $table->json('attachments')->nullable()->comment('Array URL attachment dari Service Desk');
            $table->timestamp('completed_at')->nullable()->comment('Waktu selesai implementasi');
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys (nullable karena bisa jadi belum sinkron)
            $table->foreign('rfc_id')->references('id')->on('rfc')->onDelete('set null');

            // Indexes
            $table->index('rfc_service_id');
            $table->index('rfc_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('implementation_reports');
    }
};
