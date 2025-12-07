<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\Dinas;
use App\Models\User;
use App\Models\ConfigurationItem;

class DevelopmentSeeder extends Seeder
{
    /**
     * Seed the application's database for development.
     * Data disesuaikan dengan struktur SSO API.
     */
    public function run(): void
    {
        // 1. Create Roles
        $roles = $this->createRoles();
        
        // 2. Create Dinas
        $dinas = $this->createDinas();
        
        // 3. Create Users (sesuai data SSO)
        $this->createUsers($roles, $dinas);
        
        // 4. Create Sample Configuration Items
        $this->createConfigurationItems($dinas);
    }

    private function createRoles(): array
    {
        $roleData = [
            ['name' => 'Admin Kota', 'slug' => 'admin_kota', 'description' => 'Administrator tingkat kota'],
            ['name' => 'Kepala Dinas', 'slug' => 'kepala_dinas', 'description' => 'Kepala Dinas/OPD'],
            ['name' => 'Admin Dinas', 'slug' => 'admin_dinas', 'description' => 'Administrator tingkat dinas/OPD'],
            ['name' => 'Kepala Seksi', 'slug' => 'kepala_seksi', 'description' => 'Kepala Seksi di dinas/OPD'],
            ['name' => 'Auditor', 'slug' => 'auditor', 'description' => 'Auditor internal'],
            ['name' => 'Teknisi', 'slug' => 'teknisi', 'description' => 'Teknisi IT'],
            ['name' => 'Staff', 'slug' => 'staff', 'description' => 'Staff biasa'],
        ];

        $roles = [];
        foreach ($roleData as $data) {
            $roles[$data['slug']] = Role::firstOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }

        $this->command->info('✅ Roles created: ' . count($roles));
        return $roles;
    }

    private function createDinas(): array
    {
        $dinasData = [
            ['name' => 'Dinas Komunikasi dan Informatika', 'type' => 'dinas', 'address' => 'Jl. Protokol No. 1'],
            ['name' => 'Inspektorat Kota', 'type' => 'dinas', 'address' => 'Jl. Protokol No. 2'],
            ['name' => 'Dinas Pendidikan', 'type' => 'dinas', 'address' => 'Jl. Pendidikan No. 5'],
            ['name' => 'Dinas Perhubungan', 'type' => 'dinas', 'address' => 'Jl. Raya No. 10'],
        ];

        $dinas = [];
        foreach ($dinasData as $data) {
            $dinas[] = Dinas::firstOrCreate(
                ['name' => $data['name']],
                $data
            );
        }

        $this->command->info('✅ Dinas created: ' . count($dinas));
        return $dinas;
    }

    private function createUsers(array $roles, array $dinas): void
    {
        // Mapping dinas name to dinas object
        $dinasMap = [
            'Dinas Komunikasi dan Informatika' => $dinas[0],
            'Inspektorat Kota' => $dinas[1],
            'Dinas Pendidikan' => $dinas[2],
            'Dinas Perhubungan' => $dinas[3],
        ];

        // Data users sesuai struktur SSO
        $usersData = [
            [
                'name' => 'Admin Kota',
                'email' => 'admin.kota@example.com',
                'password' => Hash::make('password'),
                'nip' => '198501012010011001',
                'jenis_kelamin' => 'laki-laki',
                'role_id' => $roles['admin_kota']->id,
                'dinas_id' => null,
                'unit_kerja' => 'Sekretariat Kota',
            ],
            [
                'name' => 'Kepala Dinas Kominfo',
                'email' => 'kepala.dinas@example.com',
                'password' => Hash::make('password'),
                'nip' => '197503152000031001',
                'jenis_kelamin' => 'laki-laki',
                'role_id' => $roles['kepala_dinas']->id,
                'dinas_id' => $dinasMap['Dinas Komunikasi dan Informatika']->id,
                'unit_kerja' => 'Kepala Dinas',
            ],
            [
                'name' => 'Admin Dinas Kominfo',
                'email' => 'admin.dinas@example.com',
                'password' => Hash::make('password'),
                'nip' => '199001012015041001',
                'jenis_kelamin' => 'perempuan',
                'role_id' => $roles['admin_dinas']->id,
                'dinas_id' => $dinasMap['Dinas Komunikasi dan Informatika']->id,
                'unit_kerja' => 'Sekretariat Dinas',
            ],
            [
                'name' => 'Kepala Seksi Pengembangan',
                'email' => 'kepala.seksi@example.com',
                'password' => Hash::make('password'),
                'nip' => '198803072010012001',
                'jenis_kelamin' => 'perempuan',
                'role_id' => $roles['kepala_seksi']->id,
                'dinas_id' => $dinasMap['Dinas Komunikasi dan Informatika']->id,
                'unit_kerja' => 'Seksi Pengembangan Sistem',
            ],
            [
                'name' => 'Auditor Internal',
                'email' => 'auditor@example.com',
                'password' => Hash::make('password'),
                'nip' => '198206102008011002',
                'jenis_kelamin' => 'laki-laki',
                'role_id' => $roles['auditor']->id,
                'dinas_id' => $dinasMap['Inspektorat Kota']->id,
                'unit_kerja' => 'Unit Audit dan Pengawasan',
            ],
            [
                'name' => 'Teknisi IT',
                'email' => 'teknisi@example.com',
                'password' => Hash::make('password'),
                'nip' => '199205152018011001',
                'jenis_kelamin' => 'laki-laki',
                'role_id' => $roles['teknisi']->id,
                'dinas_id' => $dinasMap['Dinas Komunikasi dan Informatika']->id,
                'unit_kerja' => 'Unit Dukungan Teknis',
            ],
            [
                'name' => 'Staff Administrasi',
                'email' => 'staff@example.com',
                'password' => Hash::make('password'),
                'nip' => '199508202019032001',
                'jenis_kelamin' => 'perempuan',
                'role_id' => $roles['staff']->id,
                'dinas_id' => $dinasMap['Dinas Komunikasi dan Informatika']->id,
                'unit_kerja' => 'Bidang Administrasi',
                'sso_id' => 'SSO-STAFF-001',
            ],
            [
                'name' => 'Dawwas Ulhaq',
                'email' => 'dawwas.inha@gmail.com',
                'password' => Hash::make('password'),
                'nip' => '992729729727297',
                'jenis_kelamin' => 'laki-laki',
                'role_id' => $roles['staff']->id,
                'dinas_id' => $dinasMap['Dinas Perhubungan']->id,
                'unit_kerja' => 'Sekretariat Kota',
            ],
            [
                'name' => 'Ananda Zaffy Febryan',
                'email' => 'zaffy123febryan@gmail.com',
                'password' => Hash::make('password'),
                'nip' => null,
                'jenis_kelamin' => 'laki-laki',
                'role_id' => $roles['staff']->id,
                'dinas_id' => $dinasMap['Dinas Pendidikan']->id,
                'unit_kerja' => 'Bidang Keuangan',
            ],
        ];

        foreach ($usersData as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->command->info('✅ Users created: ' . count($usersData));
        $this->command->line('');
        $this->command->line('   📧 Login credentials:');
        $this->command->line('   - admin.kota@example.com');
        $this->command->line('   - kepala.dinas@example.com');
        $this->command->line('   - admin.dinas@example.com');
        $this->command->line('   - kepala.seksi@example.com');
        $this->command->line('   - auditor@example.com');
        $this->command->line('   - teknisi@example.com');
        $this->command->line('   - staff@example.com');
        $this->command->line('   - dawwas.inha@gmail.com');
        $this->command->line('   - zaffy123febryan@gmail.com');
        $this->command->line('   🔑 Password: password');
        $this->command->line('');
    }

    private function createConfigurationItems(array $dinas): void
    {
        $items = [
            [
                'name' => 'Server Database Utama',
                'ci_code' => 'SRV-DB-001',
                'type' => 'server',
                'owner_dinas_id' => $dinas[0]->id, // Diskominfo
                'environment' => 'production',
                'criticality' => 'critical',
                'status' => 'active',
                'version' => 'MySQL 8.0',
                'os_name' => 'Ubuntu Server 22.04 LTS',
                'ip_address' => '192.168.1.10',
                'relation_note' => 'Server utama untuk database aplikasi SIMANTIC',
            ],
            [
                'name' => 'Laptop Admin Dinas',
                'ci_code' => 'LPT-ADM-001',
                'type' => 'hardware',
                'owner_dinas_id' => $dinas[0]->id,
                'environment' => 'production',
                'criticality' => 'medium',
                'status' => 'active',
                'version' => 'Dell Latitude 5420',
                'os_name' => 'Windows 11 Pro',
                'ip_address' => null,
                'relation_note' => 'Laptop untuk admin dinas kominfo',
            ],
            [
                'name' => 'Router Utama',
                'ci_code' => 'NET-RTR-001',
                'type' => 'network',
                'owner_dinas_id' => $dinas[0]->id,
                'environment' => 'production',
                'criticality' => 'critical',
                'status' => 'active',
                'version' => 'Cisco ISR 4000',
                'os_name' => 'IOS XE 17.3',
                'ip_address' => '192.168.1.1',
                'relation_note' => 'Router utama untuk koneksi internet',
            ],
            [
                'name' => 'Aplikasi SIMANTIC',
                'ci_code' => 'APP-SIM-001',
                'type' => 'aplikasi',
                'owner_dinas_id' => $dinas[0]->id,
                'environment' => 'production',
                'criticality' => 'critical',
                'status' => 'active',
                'version' => 'v1.0.0',
                'os_name' => null,
                'ip_address' => null,
                'relation_note' => 'Aplikasi Sistem Manajemen Teknologi Informasi dan Komunikasi',
            ],
        ];

        foreach ($items as $itemData) {
            ConfigurationItem::firstOrCreate(
                ['ci_code' => $itemData['ci_code']],
                $itemData
            );
        }

        $this->command->info('✅ Configuration Items created: ' . count($items));
        
        // 5. Create Sample RFCs
        $this->createSampleRfcs();
        
        $this->command->line('');
        $this->command->info('✅ Development data seeded successfully!');
    }

    private function createSampleRfcs(): void
    {
        $staffUser = User::where('email', 'staff@example.com')->first();
        
        if (!$staffUser) {
            $this->command->warn('⚠️ Staff user not found, skipping RFC creation');
            return;
        }

        $rfcs = [
            [
                'rfc_service_id' => 'RFC-2025-001',
                'title' => 'Permohonan Update Sistem Pelaporan',
                'description' => 'Diperlukan pembaruan pada modul pelaporan kinerja agar sesuai dengan format terbaru dari BKN.',
                'priority' => 'low',
                'status' => 'pending',
                'sso_id' => 'SSO-STAFF-001',
                'ci_code' => 'APP-SIM-001',
                'requested_at' => now()->subDays(2),
            ],
            [
                'rfc_service_id' => 'RFC-2025-002',
                'title' => 'Perbaikan Server Database',
                'description' => 'Server database mengalami lag saat jam sibuk, perlu dilakukan optimasi.',
                'priority' => 'high',
                'status' => 'pending',
                'sso_id' => 'SSO-STAFF-001',
                'ci_code' => 'SRV-DB-001',
                'requested_at' => now()->subDays(1),
            ],
            [
                'rfc_service_id' => 'RFC-2025-003',
                'title' => 'Instalasi Software Baru',
                'description' => 'Membutuhkan instalasi software untuk keperluan desain grafis.',
                'priority' => 'medium',
                'status' => 'pending',
                'sso_id' => 'SSO-STAFF-001',
                'ci_code' => 'LPT-ADM-001',
                'requested_at' => now(),
            ],
        ];

        foreach ($rfcs as $rfcData) {
            \App\Models\Rfc::create($rfcData);
        }

        $this->command->info('✅ Sample RFCs created: ' . count($rfcs));
    }
}
