<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // pemilik notif (user aplikasi SIMANTIC)
            $table->foreignId('user_id')->constrained('users');

            // judul & pesan singkat
            $table->string('title', 255);
            $table->text('message')->nullable();

            // referensi ke objek terkait (misal rfc_id)
            $table->string('ref_type', 50)->nullable(); // contoh: "rfc"
            $table->unsignedBigInteger('ref_id')->nullable();

            // status dibaca
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'is_read']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
