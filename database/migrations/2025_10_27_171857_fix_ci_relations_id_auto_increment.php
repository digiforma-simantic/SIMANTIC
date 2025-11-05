<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // pastikan PK sudah di kolom id (umumnya sudah)
        // ubah kolom id jadi AUTO_INCREMENT (tanpa ADD PRIMARY KEY lagi)
        DB::statement("
            ALTER TABLE ci_relations
            MODIFY COLUMN id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE ci_relations
            MODIFY COLUMN id BIGINT UNSIGNED NOT NULL
        ");
    }
};
