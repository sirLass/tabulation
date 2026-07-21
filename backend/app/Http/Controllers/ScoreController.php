<?php

namespace App\Http\Controllers;

use App\Models\Score;
use App\Models\Pageant;
use App\Models\CandidateSegmentScore;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function index(Pageant $pageant)
    {
        $pageant = Pageant::where('user_id', request()->user()->id)->findOrFail($pageant->id);

        $query = $pageant->scores();

        if (request('segment_id')) {
            $query->where('segment_id', request('segment_id'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request, Pageant $pageant)
    {
        $pageant = Pageant::where('user_id', $request->user()->id)->findOrFail($pageant->id);

        $validated = $request->validate([
            'segment_id' => 'required|exists:segments,id',
            'candidate_id' => 'required|exists:candidates,id',
            'criterion_id' => 'required|exists:criteria,id',
            'score' => 'required|integer|min:0|max:100',
        ]);

        $score = Score::updateOrCreate(
            [
                'pageant_id' => $pageant->id,
                'segment_id' => $validated['segment_id'],
                'candidate_id' => $validated['candidate_id'],
                'criterion_id' => $validated['criterion_id'],
            ],
            ['score' => $validated['score']]
        );

        return response()->json($score);
    }

    public function segmentAverages(Pageant $pageant)
    {
        $pageant = Pageant::where('user_id', request()->user()->id)->findOrFail($pageant->id);

        $query = CandidateSegmentScore::where('pageant_id', $pageant->id);

        if (request('segment_id')) {
            $query->where('segment_id', request('segment_id'));
        }

        return response()->json($query->get());
    }

    public function saveSegmentAverage(Request $request, Pageant $pageant)
    {
        $pageant = Pageant::where('user_id', $request->user()->id)->findOrFail($pageant->id);

        $validated = $request->validate([
            'segment_id' => 'required|exists:segments,id',
            'candidate_id' => 'required|exists:candidates,id',
            'total_score' => 'required|numeric|min:0',
            'average_score' => 'required|numeric|min:0',
        ]);

        $record = CandidateSegmentScore::updateOrCreate(
            [
                'pageant_id' => $pageant->id,
                'segment_id' => $validated['segment_id'],
                'candidate_id' => $validated['candidate_id'],
            ],
            [
                'total_score' => $validated['total_score'],
                'average_score' => $validated['average_score'],
            ]
        );

        return response()->json($record);
    }
}
