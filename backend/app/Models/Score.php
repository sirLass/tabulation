<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['pageant_id', 'segment_id', 'candidate_id', 'criterion_id', 'score'])]
class Score extends Model
{
    protected function casts(): array
    {
        return [
            'score' => 'integer',
        ];
    }
}
