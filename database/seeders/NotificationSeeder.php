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
                'status' => 'unread',
                'description' => 'Ini adalah pesan notifikasi untuk user id 9.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 10,
                'status' => 'unread',
                'description' => 'Ini adalah pesan notifikasi untuk user id 10.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 11,
                'status' => 'unread',
                'description' => 'Ini adalah pesan notifikasi untuk user id 11.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 12,
                'status' => 'unread',
                'description' => 'Ini adalah pesan notifikasi untuk user id 12.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 13,
                'status' => 'unread',
                'description' => 'Ini adalah pesan notifikasi untuk user id 13.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 14,
                'status' => 'unread',
                'description' => 'Ini adalah pesan notifikasi untuk user id 14.',
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('notifications')->insert($notifications);
    }
}
