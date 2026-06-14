<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'first_name', 'last_name', 'email'])]
class Candidate extends Model
{
    public function pageants()
    {
        return $this->belongsToMany(Pageant::class, 'pageant_candidate');
    }
}
