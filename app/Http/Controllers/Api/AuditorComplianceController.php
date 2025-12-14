<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditorCompliance;
use Illuminate\Http\Request;

class AuditorComplianceController extends Controller
{
    // GET /api/v1/auditor-compliances
    public function index()
    {
        $compliances = AuditorCompliance::with('auditor')->latest()->get();
        return response()->json(['success' => true, 'data' => $compliances]);
    }

    // POST /api/v1/auditor-compliances
    public function store(Request $request)
    {
        $validated = $request->validate([
            'auditor_id' => 'required|exists:users,id',
            'dinas' => 'required|string',
            'deskripsi' => 'required|string',
            'periode' => 'required|string',
            'attachment_audit' => 'nullable|string',
            'compliance' => 'required|in:compliant,non-compliant',
        ]);
        $compliance = AuditorCompliance::create($validated);
        return response()->json(['success' => true, 'data' => $compliance], 201);
    }

    // GET /api/v1/auditor-compliances/{id}
    public function show($id)
    {
        $compliance = AuditorCompliance::with('auditor')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $compliance]);
    }

    // PUT/PATCH /api/v1/auditor-compliances/{id}
    public function update(Request $request, $id)
    {
        $compliance = AuditorCompliance::findOrFail($id);
        $validated = $request->validate([
            'auditor_id' => 'sometimes|exists:users,id',
            'dinas' => 'sometimes|string',
            'deskripsi' => 'sometimes|string',
            'periode' => 'sometimes|string',
            'attachment_audit' => 'nullable|string',
            'compliance' => 'sometimes|in:compliant,non-compliant',
        ]);
        $compliance->update($validated);
        return response()->json(['success' => true, 'data' => $compliance]);
    }

    // DELETE /api/v1/auditor-compliances/{id}
    public function destroy($id)
    {
        $compliance = AuditorCompliance::findOrFail($id);
        $compliance->delete();
        return response()->json(['success' => true, 'message' => 'Deleted successfully']);
    }
}
