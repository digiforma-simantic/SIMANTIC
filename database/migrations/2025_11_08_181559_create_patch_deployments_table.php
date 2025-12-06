<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patch_deployments', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('patch_id')
                ->constrained('patch_catalogs');

            $table->foreignId('ci_id')
                ->constrained('configuration_items');

            $table->enum('status', ['planned', 'deployed', 'failed', 'rolled_back'])
                ->default('planned');

            $table->dateTime('deployed_at')->nullable();

            $table->foreignId('ref_rfc_id')
                ->nullable()
                ->constrained('rfc');

            $table->foreignId('technician_id')
                ->nullable()
                ->constrained('users');

            $table->timestamps();

            $table->index(['ci_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patch_deployments');
    }
};
