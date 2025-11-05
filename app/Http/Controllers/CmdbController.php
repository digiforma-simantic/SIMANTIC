<?php

namespace App\Http\Controllers;

use App\Models\ConfigurationItem;

class CmdbController extends Controller
{
    public function show(ConfigurationItem $config_item)
    {
        $ci = $config_item->load([
            'outgoingRelations.target:id,ci_code,name,type',
            'incomingRelations.source:id,ci_code,name,type',
        ]);

        return response()->json([
            'ci' => [
                'id'      => $ci->id,
                'ci_code' => $ci->ci_code,
                'name'    => $ci->name,
                'type'    => $ci->type,
                'owner'   => $ci->owner,
                'status'  => $ci->status,
            ],
            'dependencies' => [
                'depends_on' => $ci->outgoingRelations->map(fn($r)=>[
                    'relation_type'=>$r->relation_type,
                    'target'=>[
                        'id'=>$r->target->id,'ci_code'=>$r->target->ci_code,'name'=>$r->target->name,'type'=>$r->target->type
                    ],
                ]),
                'required_by' => $ci->incomingRelations->map(fn($r)=>[
                    'relation_type'=>$r->relation_type,
                    'source'=>[
                        'id'=>$r->source->id,'ci_code'=>$r->source->ci_code,'name'=>$r->source->name,'type'=>$r->source->type
                    ],
                ]),
            ],
        ]);
    }
}
