<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CiRelation extends Model
{
    use HasFactory;

    // default auto-increment BIGINT
    protected $fillable = ['source_ci_id','target_ci_id','relation_type'];

    public function source()
    {
        return $this->belongsTo(ConfigurationItem::class, 'source_ci_id');
    }

    public function target()
    {
        return $this->belongsTo(ConfigurationItem::class, 'target_ci_id');
    }
}
