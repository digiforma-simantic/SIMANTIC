<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rfc;
use App\Models\PatchDeployment;
use App\Models\ConfigurationItem;

// ...existing code...
class ReportController extends Controller
{
    // ...existing code...
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

    // ...existing code...
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
