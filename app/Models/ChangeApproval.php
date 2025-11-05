<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChangeApproval extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','change_id','approver_id','stage','decision','note','decided_at'];
}
