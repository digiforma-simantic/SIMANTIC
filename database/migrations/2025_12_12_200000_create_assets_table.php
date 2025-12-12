<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('aset_uuid')->unique(); // kode_bmd dari tim aset
            $table->string('nama'); // nama aset
            $table->string('lokasi')->nullable(); // nama lokasi (bisa diisi langsung, atau join ke master)
            $table->string('penanggung_jawab')->nullable(); // nama penanggung jawab
            $table->string('level_resiko')->nullable(); // level resiko
            $table->string('sub_kategori')->nullable(); // sub kategori
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('assets');
    }
};
