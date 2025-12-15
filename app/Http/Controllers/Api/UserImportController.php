<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserImportService;
use Illuminate\Http\Request;

class UserImportController extends Controller
{
    protected $importService;

    public function __construct(UserImportService $importService)
    {
        $this->importService = $importService;
    }

    // ...existing code...
    public function import(Request $request)
    {
        $ssoToken = $request->input('sso_token');
        
        $result = $this->importService->importFromSsoApi($ssoToken);

        $statusCode = $result['success'] ? 200 : 500;

        return response()->json($result, $statusCode);
    }
}
