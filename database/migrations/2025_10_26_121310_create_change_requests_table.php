<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('change_requests', function (Blueprint $t) {
            $t->uuid('id')->primary();                  // cr_id
            $t->unsignedBigInteger('requester_id')->index();
            $t->string('dinas_id', 150)->nullable()->index();
            $t->string('title', 255);
            $t->enum('type', ['standard','minor','major','emergency']);
            $t->enum('status', ['Submitted','In-Review','Approved','Rejected'])->default('Submitted');
            $t->text('description')->nullable();
            $t->text('impact_desc')->nullable();
            $t->text('rollback_plan')->nullable();
            $t->timestamp('schedule_start')->nullable()->index();
            $t->timestamp('schedule_end')->nullable()->index();
            $t->decimal('risk_score', 6, 2)->nullable();
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('change_requests');
    }
};
