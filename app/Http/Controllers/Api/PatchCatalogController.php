<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PatchCatalog;

// ...existing code...
class PatchCatalogController extends Controller
{
    // ...existing code...
    public function index()
    {
        $catalogs = PatchCatalog::orderByDesc('created_at')->get();

        return response()->json($catalogs);
    }

    // ...existing code...
    public function store(Request $request)
    {
        $data = $request->validate([
            'vendor'     => 'required|string|max:100',
            'patch_code' => 'required|string|max:100',
            'severity'   => 'required|in:low,medium,high,critical',
            'notes'      => 'nullable|string|max:500',
        ]);

        $catalog = PatchCatalog::create($data);

        return response()->json($catalog, 201);
    }

    // ...existing code...
    public function show(PatchCatalog $patch_catalog)
    {
        return response()->json($patch_catalog);
    }
}
