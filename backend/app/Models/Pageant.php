<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'name', 'organization_name', 'country', 'province', 'city', 'barangay', 'zip', 'date', 'status', 'logo', 'cover_photo'])]
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

    public function judges()
    {
        return $this->belongsToMany(User::class, 'judge_pageant', 'pageant_id', 'user_id');
    }

    public function criteria()
    {
        return $this->hasMany(Criterion::class);
    }

    public function segments()
    {
        return $this->hasMany(Segment::class);
    }

    public function scores()
    {
        return $this->hasMany(Score::class);
    }
}
