<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compliance_reviews', function (Blueprint $table) {
            $table->id(); // BIGINT, PK
            $table->foreignId('rfc_id')
                ->unique()
                ->constrained('rfc');

            $table->string('standard_ref', 150);
            $table->boolean('compliant')->default(false);
            $table->text('notes')->nullable();
            $table->foreignId('reviewer_id')
                ->constrained('users');

            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compliance_reviews');
    }
};
