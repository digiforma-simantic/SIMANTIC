<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rfc', function (Blueprint $table) {
            // kode tiket dari Service Desk
            $table->string('ticket_code')
                  ->nullable()
                  ->after('id');

            // catatan teknisi dari Service Desk
            $table->text('tech_note')
                  ->nullable()
                  ->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('rfc', function (Blueprint $table) {
            $table->dropColumn(['ticket_code', 'tech_note']);
        });
    }
};
