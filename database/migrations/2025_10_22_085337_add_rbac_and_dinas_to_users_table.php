<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $t) {
            if (!Schema::hasColumn('users','dinas_id'))   $t->string('dinas_id',100)->nullable()->index();
            if (!Schema::hasColumn('users','role'))       $t->string('role',50)->default('user')->index();
            if (!Schema::hasColumn('users','stage'))      $t->string('stage',50)->nullable();
            if (!Schema::hasColumn('users','is_active'))  $t->boolean('is_active')->default(true);
            if (!Schema::hasColumn('users','sso_sub'))    $t->string('sso_sub',191)->nullable()->unique();
        });
    }

    public function down(): void {
        Schema::table('users', function (Blueprint $t) {
            $t->dropColumn(['dinas_id','role','stage','is_active','sso_sub']);
        });
    }
};
