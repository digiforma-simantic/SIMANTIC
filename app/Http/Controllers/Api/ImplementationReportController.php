<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImplementationReport;
use App\Models\Rfc;
use App\Models\ConfigurationItem;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Implementation Report",
 *     description="API untuk laporan implementasi dari Service Desk setelah perbaikan selesai"
 * )
 */
class ImplementationReportController extends Controller
{
    /**
     * @OA\Post(
     *   path="/api/v1/implementation-reports",
     *   tags={"Implementation Report"},
     *   summary="Submit laporan implementasi dari Service Desk - No Authentication Required",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"rfc_service_id","status","description"},
     *       @OA\Property(property="rfc_service_id", type="string", example="SD-2025-001"),
     *       @OA\Property(property="status", type="string", enum={"success","failed","partial"}, example="success"),
     *       @OA\Property(property="description", type="string", example="Perbaikan server berhasil. RAM upgrade 16GB."),
     *       @OA\Property(property="attachments", type="array", @OA\Items(type="string"), example={"https://example.com/report.pdf"}),
     *       @OA\Property(property="completed_at", type="string", format="date-time", example="2025-12-07 15:30:00")
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Laporan berhasil diterima",
     *     @OA\JsonContent(
     *       @OA\Property(property="status", type="boolean", example=true),
     *       @OA\Property(property="message", type="string", example="Implementation report received successfully"),
     *       @OA\Property(
     *         property="data",
     *         type="object",
     *         @OA\Property(property="id", type="integer", example=1),
     *         @OA\Property(property="rfc_service_id", type="string", example="SD-2025-001"),
     *         @OA\Property(property="status", type="string", example="success"),
     *         @OA\Property(property="synced", type="boolean", example=true),
     *         @OA\Property(property="rfc_id", type="integer", example=5)
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=422,
     *     description="Validasi gagal",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="The rfc service id field is required."),
     *       @OA\Property(property="errors", type="object")
     *     )
     *   )
     * )
     */
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

    /**
     * @OA\Get(
     *   path="/api/v1/implementation-reports",
     *   tags={"Implementation Report"},
     *   summary="List semua implementation reports",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="rfc_id",
     *     in="query",
     *     required=false,
     *     description="Filter by RFC ID",
     *     @OA\Schema(type="integer")
     *   ),
     *   @OA\Parameter(
     *     name="status",
     *     in="query",
     *     required=false,
     *     description="Filter by status (success, failed, partial)",
     *     @OA\Schema(type="string")
     *   ),
     *   @OA\Parameter(
     *     name="page",
     *     in="query",
     *     required=false,
     *     description="Page number",
     *     @OA\Schema(type="integer", default=1)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="List implementation reports with pagination",
     *     @OA\JsonContent(
     *       @OA\Property(property="current_page", type="integer", example=1),
     *       @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *       @OA\Property(property="total", type="integer", example=100)
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthorized")
     * )
     */
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

    /**
     * @OA\Get(
     *   path="/api/v1/implementation-reports/{id}",
     *   tags={"Implementation Report"},
     *   summary="Detail implementation report",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="Implementation Report ID",
     *     @OA\Schema(type="integer")
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Detail report",
     *     @OA\JsonContent(
     *       @OA\Property(property="status", type="boolean", example=true),
     *       @OA\Property(
     *         property="data",
     *         type="object",
     *         @OA\Property(property="id", type="integer", example=1),
     *         @OA\Property(property="rfc_service_id", type="string", example="SD-2025-001"),
     *         @OA\Property(property="rfc_id", type="integer", example=5),
     *         @OA\Property(property="status", type="string", example="success"),
     *         @OA\Property(property="description", type="string", example="Perbaikan berhasil"),
     *         @OA\Property(property="attachments", type="array", @OA\Items(type="string")),
     *         @OA\Property(property="completed_at", type="string", format="date-time"),
     *         @OA\Property(property="rfc", type="object")
     *       )
     *     )
     *   ),
     *   @OA\Response(response=404, description="Not found"),
     *   @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function show(ImplementationReport $implementationReport)
    {
        $implementationReport->load(['rfc']);

        return response()->json([
            'status' => true,
            'data' => $implementationReport,
        ]);
    }
}
