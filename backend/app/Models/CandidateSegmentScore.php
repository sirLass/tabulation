<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['pageant_id', 'segment_id', 'candidate_id', 'total_score', 'average_score'])]
class CandidateSegmentScore extends Model
{
    protected $table = 'candidate_segment_scores';

    public function pageant()
    {
        return $this->belongsTo(Pageant::class);
    }

    public function segment()
    {
        return $this->belongsTo(Segment::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
