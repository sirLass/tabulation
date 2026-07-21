<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['pageant_id', 'name', 'type'])]
class Segment extends Model
{
    public function pageant()
    {
        return $this->belongsTo(Pageant::class);
    }
}
