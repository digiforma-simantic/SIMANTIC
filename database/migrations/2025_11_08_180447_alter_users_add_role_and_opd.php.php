<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // sesuaikan posisi dengan kebutuhanmu
            $table->enum('role', [
                'admin_sd',
                'admin_change',
                'approver_kasi',
                'approver_kabid',
                'approver_kadis',
                'technician',
                'auditor',
                'user_opd',
            ])->default('user_opd');

            $table->foreignId('opd_id')
                ->nullable()
                ->constrained('opd');

            $table->index('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['opd_id']);
            $table->dropColumn(['role', 'opd_id']);
        });
    }
};
