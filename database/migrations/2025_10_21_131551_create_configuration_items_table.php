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
        Schema::create('configuration_items', function (Blueprint $table) {
            $table->uuid('id')->primary();                // pakai UUID sebagai primary key
            $table->string('ci_code')->unique();          // kode unik CI, misal PRN-001
            $table->string('name');                       // nama aset/komponen
            $table->string('type')->index();              // tipe (server, app, printer, network, dsb)
            $table->string('owner')->nullable();          // pemilik CI
            $table->string('status')->default('active');  // active/inactive/retired
            $table->json('attributes')->nullable();       // info tambahan fleksibel
            $table->timestamps();                         // created_at & updated_at
            $table->softDeletes();                        // deleted_at (jika pakai soft delete)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configuration_items');
    }
};
