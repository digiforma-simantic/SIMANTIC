<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dinas_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role'); // harus sesuai table role
            $table->unsignedBigInteger('dinas_id');
            $table->string('sso_id')->nullable();
            $table->foreign('dinas_id')->references('id')->on('dinas')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dinas_users');
    }
};
