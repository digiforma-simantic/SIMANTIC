<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
    Schema::table('configuration_items', function (Blueprint $table) {
        // Data dari API Aset - tambahkan hanya yang belum ada
        if (!Schema::hasColumn('configuration_items', 'asset_id')) {
            $table->string('asset_id')->nullable()->after('id');
            $table->index('asset_id');
        }
        
        if (!Schema::hasColumn('configuration_items', 'subkategori')) {
            $table->string('subkategori')->nullable()->after('type');
        }
        
        if (!Schema::hasColumn('configuration_items', 'lokasi')) {
            $table->string('lokasi')->nullable()->after('subkategori');
        }
        
        if (!Schema::hasColumn('configuration_items', 'penanggung_jawab')) {
            $table->string('penanggung_jawab')->nullable()->after('lokasi');
        }
        
        if (!Schema::hasColumn('configuration_items', 'is_usage')) {
            $table->string('is_usage')->nullable()->after('penanggung_jawab');
        }
        
        // ci_code, os_name, ip_address, relation_note sudah ada di migration sebelumnya
        // Tambahkan unique constraint untuk ci_code jika belum ada
        if (Schema::hasColumn('configuration_items', 'ci_code')) {
            $table->unique('ci_code');
        }
    });
}

public function down(): void
{
    Schema::table('configuration_items', function (Blueprint $table) {
        // Drop index jika ada
        $indexName = 'configuration_items_asset_id_index';
        if (Schema::hasColumn('configuration_items', 'asset_id')) {
            try {
                $table->dropIndex($indexName);
            } catch (\Exception $e) {
                // Index mungkin tidak ada
            }
        }
        
        // Drop unique constraint untuk ci_code
        if (Schema::hasColumn('configuration_items', 'ci_code')) {
            try {
                $table->dropUnique(['ci_code']);
            } catch (\Exception $e) {
                // Constraint mungkin tidak ada
            }
        }
        
        // Drop kolom hanya yang ditambahkan di migration ini
        if (Schema::hasColumn('configuration_items', 'asset_id')) {
            $table->dropColumn('asset_id');
        }
        if (Schema::hasColumn('configuration_items', 'subkategori')) {
            $table->dropColumn('subkategori');
        }
        if (Schema::hasColumn('configuration_items', 'lokasi')) {
            $table->dropColumn('lokasi');
        }
        if (Schema::hasColumn('configuration_items', 'penanggung_jawab')) {
            $table->dropColumn('penanggung_jawab');
        }
        if (Schema::hasColumn('configuration_items', 'is_usage')) {
            $table->dropColumn('is_usage');
        }
    });
}
};
