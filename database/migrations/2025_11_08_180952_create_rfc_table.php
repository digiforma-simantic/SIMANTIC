<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rfc', function (Blueprint $table) {
            $table->id();
            $table->string('rfc_service_id')->nullable();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('low');
            $table->json('attachments')->nullable();
            $table->timestamp('requested_at')->nullable();
            $table->string('asset_uuid')->nullable();
            $table->string('sso_id')->nullable();

            $table->timestamps();
            $table->index('rfc_service_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rfc');
    }
};
