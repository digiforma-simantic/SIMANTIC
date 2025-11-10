<?php

namespace App\Http\Controllers;

use App\Models\ConfigurationItem;

class CmdbController extends Controller
{
    /**
     * GET /api/v1/config-items/{config_item}/graph
     * Menampilkan CI + relasi dependency-nya.
     */
    public function show(ConfigurationItem $config_item)
    {
        $config_item->load([
            'ownerOpd',
            'sourceRelations.target',
            'targetRelations.source',
        ]);

        $nodes = [
            [
                'id'   => $config_item->id,
                'name' => $config_item->name,
                'type' => $config_item->type,
                'role' => 'primary',
            ],
        ];

        $edges = [];

        foreach ($config_item->sourceRelations as $rel) {
            $nodes[] = [
                'id'   => $rel->target->id,
                'name' => $rel->target->name,
                'type' => $rel->target->type,
                'role' => 'target',
            ];

            $edges[] = [
                'from' => $config_item->id,
                'to'   => $rel->target->id,
                'type' => $rel->relation_type,
            ];
        }

        foreach ($config_item->targetRelations as $rel) {
            $nodes[] = [
                'id'   => $rel->source->id,
                'name' => $rel->source->name,
                'type' => $rel->source->type,
                'role' => 'source',
            ];

            $edges[] = [
                'from' => $rel->source->id,
                'to'   => $config_item->id,
                'type' => $rel->relation_type,
            ];
        }

        // Hilangkan duplikat node
        $nodes = collect($nodes)->unique('id')->values()->all();

        return response()->json([
            'root'  => $config_item,
            'nodes' => $nodes,
            'edges' => $edges,
        ]);
    }
}
