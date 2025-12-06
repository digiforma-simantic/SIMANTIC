<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patch_catalogs', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->string('vendor', 100);
            $table->string('patch_code', 50);
            $table->enum('severity', ['low', 'medium', 'high', 'critical']);
            $table->string('checksum', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['vendor', 'patch_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patch_catalogs');
    }
};
