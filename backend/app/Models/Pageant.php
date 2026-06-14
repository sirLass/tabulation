<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'name', 'organization_name', 'country', 'province', 'city', 'barangay', 'zip', 'date'])]
class Pageant extends Model
{
    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'pageant_candidate');
    }
}
