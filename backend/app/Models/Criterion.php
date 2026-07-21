<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['pageant_id', 'name', 'percentage'])]
class Criterion extends Model
{
    protected $table = 'criteria';

    public function pageant()
    {
        return $this->belongsTo(Pageant::class);
    }
}
