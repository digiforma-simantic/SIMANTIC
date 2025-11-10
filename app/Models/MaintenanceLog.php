<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceLog extends Model
{
    protected $table = 'maintenance_logs';

    protected $fillable = [
        'rfc_id',           // optional: kalau maintenance terkait RFC
        'ci_id',
        'performed_by',     // FK ke users.id (technician)
        'maintenance_date',
        'type',             // preventive / corrective / adaptive / perfective
        'description',
        'downtime_minutes',
        'status',           // completed / cancelled / pending
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }

    public function configurationItem()
    {
        return $this->belongsTo(ConfigurationItem::class, 'ci_id');
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
