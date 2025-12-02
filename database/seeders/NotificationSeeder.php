<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        // Notifications for sample users
        $users = [
            'opd.dinkes@example.com',
            'admin.change@example.com',
            'opd.other@example.com'
        ];

        foreach ($users as $email) {
            $user = User::where('email', $email)->first();
            if (! $user) {
                continue;
            }

            // recent notification (Now)
            Notification::updateOrCreate(
                ['user_id' => $user->id, 'title' => 'Berhasil Diimplementasikan'],
                [
                    'message' => 'Perubahan instal aplikasi zoom pada laptop 01 telah selesai diimplementasikan',
                    'is_read' => false,
                    'ref_type' => 'rfc',
                    'ref_id' => 1,
                    'read_at' => null,
                    'created_at' => Carbon::now()->subMinutes(2),
                    'updated_at' => Carbon::now()->subMinutes(2),
                ]
            );

            // accepted by diskominfo (3 hours ago)
            Notification::updateOrCreate(
                ['user_id' => $user->id, 'title' => 'Diterima oleh Diskominfo'],
                [
                    'message' => 'Permintaan "Instal Aplikasi Zoom pada Laptop-01" sudah diteruskan ke Diskominfo',
                    'is_read' => false,
                    'ref_type' => 'rfc',
                    'ref_id' => 1,
                    'read_at' => null,
                    'created_at' => Carbon::now()->subHours(3),
                    'updated_at' => Carbon::now()->subHours(3),
                ]
            );

            // accepted by kadis (5 hours ago)
            Notification::updateOrCreate(
                ['user_id' => $user->id, 'title' => 'Diterima oleh Kepala Bidang'],
                [
                    'message' => 'Permintaan "Instal Aplikasi Zoom pada Laptop-01" disetujui Kepala Bidang',
                    'is_read' => false,
                    'ref_type' => 'rfc',
                    'ref_id' => 1,
                    'read_at' => null,
                    'created_at' => Carbon::now()->subHours(5),
                    'updated_at' => Carbon::now()->subHours(5),
                ]
            );

            // failed notification (yesterday)
            Notification::updateOrCreate(
                ['user_id' => $user->id, 'title' => 'Pengajuan Gagal'],
                [
                    'message' => 'Permintaan "Instal Game di PC-05" ditolak oleh Diskominfo',
                    'is_read' => false,
                    'ref_type' => 'rfc',
                    'ref_id' => 2,
                    'read_at' => null,
                    'created_at' => Carbon::now()->subDays(1)->subHours(2),
                    'updated_at' => Carbon::now()->subDays(1)->subHours(2),
                ]
            );
        }
    }
}
