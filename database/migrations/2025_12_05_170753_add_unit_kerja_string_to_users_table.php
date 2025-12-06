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
        Schema::table('users', function (Blueprint $table) {
            // Add unit_kerja string column for SSO data
            // This is separate from unit_kerja_id (FK) for flexibility
            if (!Schema::hasColumn('users', 'unit_kerja')) {
                $table->string('unit_kerja')->nullable()->after('unit_kerja_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'unit_kerja')) {
                $table->dropColumn('unit_kerja');
            }
        });
    }
};
