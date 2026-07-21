<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'candidate_number', 'first_name', 'last_name', 'email', 'gender', 'primary_image', 'hover_image'])]
class Candidate extends Model
{
    public function pageants()
    {
        return $this->belongsToMany(Pageant::class, 'pageant_candidate');
    }
}
