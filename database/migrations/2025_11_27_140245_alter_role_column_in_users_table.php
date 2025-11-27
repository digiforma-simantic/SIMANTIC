<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            /**
             * Ubah kolom role dari ENUM menjadi VARCHAR(50)
             * Ini agar role bisa diubah bebas tanpa dibatasi ENUM.
             */
            $table->string('role', 50)->change();
        });
    }

    public function down(): void
    {
        // Jika rollback diperlukan, bisa kembalikan ke enum lama
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'admin_change',
                'approver_kasi',
                'approver_kabid',
                'approver_kadis',
                'technician',
                'user_opd',
                'auditor_change',
            ])->change();
        });
    }
};
