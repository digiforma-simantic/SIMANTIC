<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Employee number
            if (!Schema::hasColumn('users', 'nip')) {
                $table->string('nip', 64)->nullable()->after('password');
            }

            // Gender: 'L' or 'P' or more descriptive
            if (!Schema::hasColumn('users', 'jenis_kelamin')) {
                $table->string('jenis_kelamin', 16)->nullable()->after('nip');
            }

            // New role_id FK to roles table
            if (!Schema::hasColumn('users', 'role_id')) {
                $table->unsignedBigInteger('role_id')->nullable()->after('jenis_kelamin');
                $table->foreign('role_id')->references('id')->on('roles')->nullOnDelete();
            }

            // Dinas mapping, keep existing opd_id in place (agreement)
            if (!Schema::hasColumn('users', 'dinas_id')) {
                // Keep as unsignedBigInteger; do not add foreign key here to avoid FK errors if opds table
                // is not accessible or uses non-compatible engine for FKs in some environments.
                $table->unsignedBigInteger('dinas_id')->nullable()->after('role_id');
            }

            // Unit kerja placeholder
            if (!Schema::hasColumn('users', 'unit_kerja_id')) {
                $table->unsignedBigInteger('unit_kerja_id')->nullable()->after('dinas_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'nip')) {
                $table->dropColumn('nip');
            }
            if (Schema::hasColumn('users', 'jenis_kelamin')) {
                $table->dropColumn('jenis_kelamin');
            }
            if (Schema::hasColumn('users', 'role_id')) {
                $table->dropForeign(['role_id']);
                $table->dropColumn('role_id');
            }
            if (Schema::hasColumn('users', 'dinas_id')) {
                $table->dropColumn('dinas_id');
            }
            if (Schema::hasColumn('users', 'unit_kerja_id')) {
                $table->dropColumn('unit_kerja_id');
            }
        });
    }
};
