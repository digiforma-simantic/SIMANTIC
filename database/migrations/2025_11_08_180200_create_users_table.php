<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // IDENTITAS DASAR
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password')->nullable(); // karena login via SSO

            // OPSIONAL: ID USER DI SSO (JIKA ADA)
            $table->string('sso_id')->nullable();

            // OPD (boleh null kalau belum di-mapping)
            $table->unsignedBigInteger('opd_id')->nullable();

            // ROLE SIMANTIC (RBAC)
            $table->enum('role', [
                'admin_kota',
                'admin_dinas',
                'kepala_dinas',
                'kepala_bidang',
                'kepala_seksi',
                'staff',
                'auditor',
                'teknisi',
            ])->default('staff');

            // STATUS & AUDIT
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();

            $table->rememberToken();
            $table->timestamps();

            // Kalau nanti punya tabel opds:
            // $table->foreign('opd_id')->references('id')->on('opds')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
