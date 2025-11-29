<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('roles') || !Schema::hasTable('users')) {
            return;
        }

        $roleMap = DB::table('roles')->pluck('id', 'slug');

        // Update role_id for users based on role string
        foreach ($roleMap as $slug => $id) {
            DB::table('users')->where('role', $slug)->update(['role_id' => $id]);
        }

        // Copy opd_id to dinas_id where present
        DB::table('users')->whereNotNull('opd_id')->update(['dinas_id' => DB::raw('opd_id')]);
    }

    public function down(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        DB::table('users')->update(['role_id' => null, 'dinas_id' => null]);
    }
};
