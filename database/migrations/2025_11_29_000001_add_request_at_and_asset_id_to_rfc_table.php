<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rfc', function (Blueprint $table) {
            if (!Schema::hasColumn('rfc', 'request_at')) {
                $table->dateTime('request_at')->nullable()->after('tech_note');
            }
            if (!Schema::hasColumn('rfc', 'asset_id')) {
                $table->unsignedBigInteger('asset_id')->nullable()->after('request_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('rfc', function (Blueprint $table) {
            if (Schema::hasColumn('rfc', 'asset_id')) {
                $table->dropColumn('asset_id');
            }
            if (Schema::hasColumn('rfc', 'request_at')) {
                $table->dropColumn('request_at');
            }
        });
    }
};
