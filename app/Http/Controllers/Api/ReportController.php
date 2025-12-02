<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rfc;
use App\Models\PatchDeployment;
use App\Models\ConfigurationItem;

/**
 * @OA\Tag(
 *     name="Reports & Audit",
 *     description="Laporan ringkasan Change Management dan Patch Compliance"
 * )
 */
class ReportController extends Controller
{
    /**
     * GET /api/v1/reports/change-summary
     *
     * @OA\Get(
     *   path="/api/v1/reports/change-summary",
     *   tags={"Reports & Audit"},
     *   summary="Laporan ringkasan Change Management (RFC Summary)",
     *   description="Menghasilkan ringkasan statistik dari seluruh RFC (Request for Change), mencakup status, kategori, dan jumlah total RFC per OPD.",
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(
     *     response=200,
     *     description="Ringkasan statistik Change Management",
     *     @OA\JsonContent(
     *       type="object",
     *       @OA\Property(property="overview", type="object",
     *         @OA\Property(property="total_rfc", type="integer", example=124)
     *       ),
     *       @OA\Property(property="by_priority", type="object",
     *         @OA\Property(property="low", type="integer", example=72),
     *         @OA\Property(property="medium", type="integer", example=40),
     *         @OA\Property(property="high", type="integer", example=12)
     *       ),
     *       @OA\Property(property="chart", type="object",
     *         @OA\Property(property="labels", type="array",
     *           @OA\Items(type="string", example="Low")
     *         ),
     *         @OA\Property(property="data", type="array",
     *           @OA\Items(type="integer", example=72)
     *         )
     *       )
     *     )
     *   )
     * )
     */
    public function changeSummary()
    {
        // Data agregat RFC (now from Service Desk)
        $total = Rfc::count();
        
        // RFC now uses priority instead of status/category
        $byPriority = [
            'low'    => Rfc::where('priority', 'low')->count(),
            'medium' => Rfc::where('priority', 'medium')->count(),
            'high'   => Rfc::where('priority', 'high')->count(),
        ];

        // Format untuk grafik
        $chart = [
            'labels' => ['Low', 'Medium', 'High'],
            'data'   => [$byPriority['low'], $byPriority['medium'], $byPriority['high']],
        ];

        return response()->json([
            'overview' => [
                'total_rfc' => $total,
            ],
            'by_priority' => $byPriority,
            'chart'       => $chart,
        ]);
    }

    /**
     * GET /api/v1/reports/patch-compliance
     *
     * @OA\Get(
     *   path="/api/v1/reports/patch-compliance",
     *   tags={"Reports & Audit"},
     *   summary="Laporan kepatuhan Patch Deployment (Patch Compliance)",
     *   description="Menghasilkan laporan kepatuhan patching berdasarkan status Patch Deployment di seluruh Configuration Item (CI).",
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(
     *     response=200,
     *     description="Ringkasan kepatuhan patch deployment",
     *     @OA\JsonContent(
     *       type="object",
     *       @OA\Property(property="summary", type="object",
     *         @OA\Property(property="total_patch_jobs", type="integer", example=56),
     *         @OA\Property(property="success", type="integer", example=42),
     *         @OA\Property(property="failed", type="integer", example=6),
     *         @OA\Property(property="rolled_back", type="integer", example=8),
     *         @OA\Property(property="compliance_rate", type="number", format="float", example=87.5)
     *       ),
     *       @OA\Property(property="by_status", type="object",
     *         @OA\Property(property="planned", type="integer", example=10),
     *         @OA\Property(property="deployed", type="integer", example=40),
     *         @OA\Property(property="failed", type="integer", example=6)
     *       ),
     *       @OA\Property(property="chart", type="object",
     *         @OA\Property(property="labels", type="array",
     *           @OA\Items(type="string", example="Deployed")
     *         ),
     *         @OA\Property(property="data", type="array",
     *           @OA\Items(type="integer", example=40)
     *         )
     *       )
     *     )
     *   )
     * )
     */
    public function patchCompliance()
    {
        $total = PatchDeployment::count();
        $success = PatchDeployment::where('status', 'deployed')->count();
        $failed = PatchDeployment::where('status', 'failed')->count();
        $rolled = PatchDeployment::where('status', 'rolled_back')->count();
        $planned = PatchDeployment::where('status', 'planned')->count();

        $compliance = $total > 0 ? round(($success / $total) * 100, 1) : 0;

        // Chart-friendly output
        $chart = [
            'labels' => ['Planned', 'Deployed', 'Failed', 'Rolled Back'],
            'data'   => [$planned, $success, $failed, $rolled],
        ];

        return response()->json([
            'summary' => [
                'total_patch_jobs' => $total,
                'success'          => $success,
                'failed'           => $failed,
                'rolled_back'      => $rolled,
                'compliance_rate'  => $compliance,
            ],
            'by_status' => [
                'planned'     => $planned,
                'deployed'    => $success,
                'failed'      => $failed,
                'rolled_back' => $rolled,
            ],
            'chart' => $chart,
        ]);
    }
}
