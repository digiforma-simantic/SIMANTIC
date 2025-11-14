<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('configuration_items', function (Blueprint $table) {
            // hanya tambah kalau BELUM ada
            if (!Schema::hasColumn('configuration_items', 'ci_code')) {
                $table->string('ci_code', 50)->nullable()->after('id');
            }

            if (!Schema::hasColumn('configuration_items', 'os_name')) {
                $table->string('os_name', 100)->nullable()->after('version');
            }

            if (!Schema::hasColumn('configuration_items', 'ip_address')) {
                $table->string('ip_address', 45)->nullable()->after('os_name');
            }

            if (!Schema::hasColumn('configuration_items', 'relation_note')) {
                $table->text('relation_note')->nullable()->after('ip_address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('configuration_items', function (Blueprint $table) {
            // drop kalau ada (biar aman)
            if (Schema::hasColumn('configuration_items', 'ci_code')) {
                $table->dropColumn('ci_code');
            }
            if (Schema::hasColumn('configuration_items', 'os_name')) {
                $table->dropColumn('os_name');
            }
            if (Schema::hasColumn('configuration_items', 'ip_address')) {
                $table->dropColumn('ip_address');
            }
            if (Schema::hasColumn('configuration_items', 'relation_note')) {
                $table->dropColumn('relation_note');
            }
        });
    }
};
