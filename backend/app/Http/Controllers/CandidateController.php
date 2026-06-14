<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Pageant;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $candidates = Candidate::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($candidates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $candidate = Candidate::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return response()->json($candidate, 201);
    }

    public function attachToPageant(Request $request, Pageant $pageant)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        $candidate = Candidate::findOrFail($request->candidate_id);

        if ($candidate->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $pageant->candidates()->syncWithoutDetaching($candidate->id);

        return response()->json(['message' => 'Candidate attached to pageant']);
    }

    public function pageantCandidates(Request $request, Pageant $pageant)
    {
        if ($pageant->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($pageant->candidates);
    }
}
