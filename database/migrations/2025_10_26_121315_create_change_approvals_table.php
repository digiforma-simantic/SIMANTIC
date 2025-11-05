<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('change_approvals', function (Blueprint $t) {
            $t->uuid('id')->primary();
            $t->uuid('change_id')->index();
            $t->unsignedBigInteger('approver_id')->index();
            $t->string('stage', 50)->nullable();              // kasi/kabid/diskominfo/...
            $t->enum('decision', ['approve','reject','need_info']);
            $t->text('note')->nullable();
            $t->timestamp('decided_at')->nullable();
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('change_approvals');
    }
};
