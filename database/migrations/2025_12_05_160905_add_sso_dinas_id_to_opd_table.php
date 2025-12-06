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
        Schema::table('dinas', function (Blueprint $table) {
            if (!Schema::hasColumn('dinas', 'sso_dinas_id')) {
                $table->unsignedBigInteger('sso_dinas_id')->nullable()->after('id');
                $table->index('sso_dinas_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dinas', function (Blueprint $table) {
            if (Schema::hasColumn('dinas', 'sso_dinas_id')) {
                $table->dropIndex(['sso_dinas_id']);
                $table->dropColumn('sso_dinas_id');
            }
        });
    }
};
