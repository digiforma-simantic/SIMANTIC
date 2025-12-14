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
        Schema::create('auditor_compliances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('auditor_id'); // user id
            $table->string('dinas');
            $table->text('deskripsi');
            $table->string('periode'); // contoh: Q3 2025
            $table->string('attachment_audit')->nullable();
            $table->enum('compliance', ['compliant', 'non-compliant']);
            $table->timestamps();

            $table->foreign('auditor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditor_compliances');
    }
};
