<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $notifications = [
            [
                'user_id' => 9,
                'title' => 'Notifikasi untuk user 9',
                'body' => 'Ini adalah pesan notifikasi untuk user id 9.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 10,
                'title' => 'Notifikasi untuk user 10',
                'body' => 'Ini adalah pesan notifikasi untuk user id 10.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 11,
                'title' => 'Notifikasi untuk user 11',
                'body' => 'Ini adalah pesan notifikasi untuk user id 11.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 12,
                'title' => 'Notifikasi untuk user 12',
                'body' => 'Ini adalah pesan notifikasi untuk user id 12.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 13,
                'title' => 'Notifikasi untuk user 13',
                'body' => 'Ini adalah pesan notifikasi untuk user id 13.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 14,
                'title' => 'Notifikasi untuk user 14',
                'body' => 'Ini adalah pesan notifikasi untuk user id 14.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('notifications')->insert($notifications);
    }
}
