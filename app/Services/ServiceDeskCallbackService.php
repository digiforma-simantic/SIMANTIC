<?php

namespace App\Services;

use App\Models\Rfc;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ServiceDeskCallbackService
{
    /**
     * Send RFC status callback to Service Desk
     *
     * @param Rfc $rfc
     * @param string $status approved|rejected
     * @param string|null $comment Optional comment for rejected status
     * @return bool
     */
    public function sendStatus(Rfc $rfc, string $status, ?string $comment = null): bool
    {
 
        // Check if RFC can send callback (has rfc_service_id)
        if (!$rfc->canSendCallback()) {
            Log::info('RFC callback skipped: missing rfc_service_id', [
                'rfc_id' => $rfc->id,
                'rfc_service_id' => $rfc->rfc_service_id,
            ]);
            return false;
        }

        // Validate status
        if (!in_array($status, ['approved', 'rejected'])) {
            Log::error('Invalid RFC callback status', [
                'rfc_id' => $rfc->id,
                'status' => $status,
            ]);
            return false;
        }

        // Get callback URL from config
        $callbackUrl = config('services.service_desk.callback_url');
        
        if (empty($callbackUrl)) {
            Log::error('Service Desk callback URL not configured');
            return false;
        }

        // Prepare payload
        $payload = [
            'rfc_service_id' => $rfc->rfc_service_id,
            'ci_code' => $rfc->ci_code,
            'status' => $status,
            'sso_id' => $rfc->sso_id,
            
        ];

        Log::info('payload : ' ,[
            'payload' => $payload,
        ]);

        // Add comment for rejected status
        if ($status === 'rejected' && !empty($comment)) {
            $payload['config_comment'] = $comment;
        }

        try {
            // Send POST request to Service Desk
            $response = Http::post('https://api-sindra.okkyprojects.com/api/request-changes/callback', $payload);

            if ($response->successful()) {
                Log::info('Service Desk callback sent successfully', [
                    'rfc_id' => $rfc->id,
                    'rfc_service_id' => $rfc->rfc_service_id,
                    'status' => $status,
                    'response_status' => $response->status(),
                    'response_body' => $response->json(),
                ]);
                return true;
            } else {
                Log::warning('Service Desk callback returned non-success status', [
                    'rfc_id' => $rfc->id,
                    'rfc_service_id' => $rfc->rfc_service_id,
                    'status' => $status,
                    'response_status' => $response->status(),
                    'response_body' => $response->body(),
                ]);
                return false;
            }
        } catch (\Exception $e) {
            // Log error but don't throw exception (don't block approval process)
            Log::error('Service Desk callback failed', [
                'rfc_id' => $rfc->id,
                'rfc_service_id' => $rfc->rfc_service_id,
                'status' => $status,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return false;
        }
    }
}
