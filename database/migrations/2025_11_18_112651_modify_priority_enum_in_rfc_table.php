<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Perluas enum dulu supaya nilai lama (P4, P3, P2, P1) tetap valid
        DB::statement("
            ALTER TABLE `rfc`
            MODIFY `priority` ENUM('P4', 'P3', 'P2', 'P1', 'low', 'medium', 'high') NOT NULL
        ");

        // 2. Mapping data lama ke nilai baru
        DB::statement("UPDATE `rfc` SET `priority` = 'low'    WHERE `priority` = 'P4'");
        DB::statement("UPDATE `rfc` SET `priority` = 'medium' WHERE `priority` = 'P3'");
        DB::statement("UPDATE `rfc` SET `priority` = 'high'   WHERE `priority` IN ('P2', 'P1')");

        // 3. Kecilkan enum hanya ke low/medium/high
        DB::statement("
            ALTER TABLE `rfc`
            MODIFY `priority` ENUM('low', 'medium', 'high') NOT NULL
        ");
    }

    public function down(): void
    {
        // kalau rollback, kita balikin ke enum awal (P4–P1)
        DB::statement("
            ALTER TABLE `rfc`
            MODIFY `priority` ENUM('P4', 'P3', 'P2', 'P1') NOT NULL
        ");
    }
};
