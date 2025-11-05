<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('configuration_items', function (Blueprint $t) {
            if (!Schema::hasColumn('configuration_items','ci_type'))        $t->string('ci_type', 50)->nullable()->index();
            if (!Schema::hasColumn('configuration_items','serial_number'))   $t->string('serial_number', 100)->nullable();
            if (!Schema::hasColumn('configuration_items','hostname'))        $t->string('hostname', 150)->nullable();
            if (!Schema::hasColumn('configuration_items','ip_address'))      $t->string('ip_address', 45)->nullable();
            if (!Schema::hasColumn('configuration_items','location'))        $t->string('location', 150)->nullable();
            if (!Schema::hasColumn('configuration_items','owner_dinas'))     $t->string('owner_dinas', 100)->nullable()->index();
            if (!Schema::hasColumn('configuration_items','os'))              $t->string('os', 100)->nullable();
            if (!Schema::hasColumn('configuration_items','version'))         $t->string('version', 100)->nullable();
            if (!Schema::hasColumn('configuration_items','status'))          $t->enum('status',['in_use','standby','retired'])->default('in_use')->index();
            if (!Schema::hasColumn('configuration_items','last_seen_at'))    $t->timestamp('last_seen_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('configuration_items', function (Blueprint $t) {
            foreach ([
                'ci_type','serial_number','hostname','ip_address','location',
                'owner_dinas','os','version','status','last_seen_at'
            ] as $col) {
                if (Schema::hasColumn('configuration_items',$col)) {
                    $t->dropColumn($col);
                }
            }
        });
    }
};
