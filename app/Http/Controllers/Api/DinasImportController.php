<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DinasImportService;
use Illuminate\Http\Request;

class DinasImportController extends Controller
{
    protected $importService;

    public function __construct(DinasImportService $importService)
    {
        $this->importService = $importService;
    }

    // ...existing code...
    public function import(Request $request)
    {
        $result = $this->importService->importFromSsoApi();

        $statusCode = $result['success'] ? 200 : 500;

        return response()->json($result, $statusCode);
    }
}
