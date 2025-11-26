<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rfc_attachments', function (Blueprint $table) {
            $table->id();

            // relasi ke tabel rfc
            $table->unsignedBigInteger('rfc_id');

            // URL file dari Service Desk
            $table->string('url');

            // nama file (opsional)
            $table->string('file_name')->nullable();

            // tipe file (opsional)
            $table->string('mime_type')->nullable();

            $table->timestamps();

            $table->foreign('rfc_id')
                  ->references('id')
                  ->on('rfc')   // penting: nama tabel 'rfc'
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rfc_attachments');
    }
};
