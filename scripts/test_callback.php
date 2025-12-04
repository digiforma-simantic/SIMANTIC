<?php

/**
 * Test Script: Service Desk Callback Integration
 * 
 * This script tests the complete flow:
 * 1. Create RFC from Service Desk
 * 2. Create approval decision
 * 3. Verify callback is sent to Service Desk
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Rfc;
use App\Models\RfcApproval;
use App\Models\User;
use App\Services\ServiceDeskCallbackService;

echo "=== Service Desk Callback Integration Test ===\n\n";

// Step 1: Create test RFC (simulating Service Desk POST)
echo "Step 1: Creating RFC from Service Desk...\n";
$rfc = Rfc::create([
    'rfc_service_id' => 'SD-TEST-' . time(),
    'ci_code' => 'CI-TEST-' . time(),
    'title' => 'Test RFC - Callback Integration',
    'description' => 'Testing callback functionality',
    'priority' => 'high',
    'status' => 'pending',
    'sso_id' => 'test.user@example.com',
    'asset_uuid' => 'uuid-test-123',
    'requested_at' => now(),
]);

echo "✓ RFC created: ID={$rfc->id}, rfc_service_id={$rfc->rfc_service_id}, ci_code={$rfc->ci_code}\n\n";

// Step 2: Verify RFC can send callback
echo "Step 2: Checking if RFC can send callback...\n";
if ($rfc->canSendCallback()) {
    echo "✓ RFC can send callback (has rfc_service_id and ci_code)\n\n";
} else {
    echo "✗ RFC cannot send callback\n\n";
    exit(1);
}

// Step 3: Test callback service with different statuses
$callbackService = new ServiceDeskCallbackService();

echo "Step 3: Testing callback service...\n\n";

// Test 3a: Approved status
echo "Test 3a: Sending 'approved' callback...\n";
$rfc->status = 'approved';
$rfc->save();

$result = $callbackService->sendStatus($rfc, 'approved');
echo $result ? "✓ Callback sent successfully\n" : "✗ Callback failed (check logs)\n";
echo "Expected payload:\n";
echo json_encode([
    'rfc_service_id' => $rfc->rfc_service_id,
    'ci_code' => $rfc->ci_code,
    'status' => 'approved',
    'sso_id' => $rfc->sso_id,
], JSON_PRETTY_PRINT) . "\n\n";

// Test 3b: Rejected status
echo "Test 3b: Sending 'rejected' callback...\n";
$rfc->status = 'rejected';
$rfc->save();

$result = $callbackService->sendStatus($rfc, 'rejected');
echo $result ? "✓ Callback sent successfully\n" : "✗ Callback failed (check logs)\n";
echo "Expected payload:\n";
echo json_encode([
    'rfc_service_id' => $rfc->rfc_service_id,
    'ci_code' => $rfc->ci_code,
    'status' => 'rejected',
    'sso_id' => $rfc->sso_id,
], JSON_PRETTY_PRINT) . "\n\n";

// Test 3c: Pending status with comment
echo "Test 3c: Sending 'pending' callback with comment...\n";
$rfc->status = 'pending';
$rfc->config_comment = 'Mohon lengkapi dokumentasi teknis sebelum disetujui';
$rfc->save();

$result = $callbackService->sendStatus($rfc, 'pending', $rfc->config_comment);
echo $result ? "✓ Callback sent successfully\n" : "✗ Callback failed (check logs)\n";
echo "Expected payload:\n";
echo json_encode([
    'rfc_service_id' => $rfc->rfc_service_id,
    'ci_code' => $rfc->ci_code,
    'status' => 'pending',
    'sso_id' => $rfc->sso_id,
    'config_comment' => $rfc->config_comment,
], JSON_PRETTY_PRINT) . "\n\n";

// Step 4: Check configuration
echo "Step 4: Checking configuration...\n";
$callbackUrl = config('services.service_desk.callback_url');
echo "Callback URL: {$callbackUrl}\n\n";

// Step 5: Show recent logs
echo "Step 5: Recent callback logs:\n";
echo "Check logs with: tail -100 storage/logs/laravel.log | grep -i callback\n\n";

// Cleanup
echo "Cleanup: Deleting test RFC...\n";
$rfc->delete();
echo "✓ Test RFC deleted\n\n";

echo "=== Test Complete ===\n";
echo "\nNext steps:\n";
echo "1. Check logs: tail storage/logs/laravel.log\n";
echo "2. Verify Service Desk received callbacks\n";
echo "3. Test via UI by approving actual RFC\n";
