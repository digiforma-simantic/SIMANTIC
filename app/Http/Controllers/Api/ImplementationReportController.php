<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImplementationReport;
use App\Models\Rfc;
use App\Models\ConfigurationItem;
use Illuminate\Http\Request;

// ...existing code...
class ImplementationReportController extends Controller
{
    // ...existing code...
    public function store(Request $request)
    {
        // Validasi input dari Service Desk
        $validated = $request->validate([
            'rfc_service_id' => 'required|string|max:255',
            'status'         => 'required|in:success,failed,partial',
            'description'    => 'required|string',
            'attachments'    => 'nullable|array',
            'attachments.*'  => 'string',
            'completed_at'   => 'nullable|date',
        ]);

        // Set completed_at default jika tidak ada
        if (!isset($validated['completed_at'])) {
            $validated['completed_at'] = now();
        }

        // Cari RFC internal berdasarkan rfc_service_id
        $rfc = Rfc::where('rfc_service_id', $validated['rfc_service_id'])->first();
        if ($rfc) {
            $validated['rfc_id'] = $rfc->id;
        }

        // Simpan laporan implementasi
        $report = ImplementationReport::create($validated);

        // Update status RFC jika ditemukan
        if ($rfc) {
            $newStatus = match($validated['status']) {
                'success' => 'completed',
                'failed' => 'failed',
                'partial' => 'partially_completed',
            };
            
            $rfc->update(['status' => $newStatus]);
        }

        // Response
        return response()->json([
            'status' => true,
            'message' => 'Implementation report received successfully',
            'data' => [
                'id' => $report->id,
                'rfc_service_id' => $report->rfc_service_id,
                'status' => $report->status,
                'synced' => $rfc ? true : false,
                'rfc_id' => $report->rfc_id,
            ]
        ], 201);
    }

    // ...existing code...
    public function index(Request $request)
    {
        $query = ImplementationReport::with(['rfc']);

        // Filter by RFC ID
        if ($request->has('rfc_id')) {
            $query->where('rfc_id', $request->rfc_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($reports);
    }

    // ...existing code...
    public function show(ImplementationReport $implementationReport)
    {
        $implementationReport->load(['rfc']);

        return response()->json([
            'status' => true,
            'data' => $implementationReport,
        ]);
    }
}
