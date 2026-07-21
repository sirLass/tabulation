<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Pageant;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int)($request->query('per_page', 10)), 50);
        $candidates = Candidate::where('user_id', $request->user()->id)
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->paginate($perPage);

        return response()->json($candidates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'gender' => 'nullable|in:Male,Female',
            'pageant_id' => 'nullable|exists:pageants,id',
            'primary_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'hover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->filled('pageant_id')) {
            $pageant = Pageant::findOrFail($validated['pageant_id']);
            if ($pageant->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        $gender = $validated['gender'] ?? null;
        $lastNumber = Candidate::where('user_id', $request->user()->id)
            ->where('gender', $gender)
            ->max('candidate_number');
        $nextNumber = $lastNumber ? str_pad((int)$lastNumber + 1, 2, '0', STR_PAD_LEFT) : '01';

        $data = [
            'user_id' => $request->user()->id,
            'candidate_number' => $nextNumber,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'] ?? null,
            'gender' => $gender,
        ];

        if ($request->hasFile('primary_image')) {
            $data['primary_image'] = $request->file('primary_image')->store('candidates', 'public');
        }

        if ($request->hasFile('hover_image')) {
            $data['hover_image'] = $request->file('hover_image')->store('candidates', 'public');
        }

        $candidate = Candidate::create($data);

        if ($request->filled('pageant_id')) {
            $pageant->candidates()->syncWithoutDetaching($candidate->id);
        }

        return response()->json($candidate, 201);
    }

    public function update(Request $request, Candidate $candidate)
    {
        if ($candidate->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'gender' => 'nullable|in:Male,Female',
            'candidate_number' => 'nullable|string|max:10',
            'pageant_id' => 'nullable|exists:pageants,id',
            'primary_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'hover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->filled('pageant_id')) {
            $pageant = Pageant::findOrFail($validated['pageant_id']);
            if ($pageant->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        $data = [
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'candidate_number' => $validated['candidate_number'] ?? null,
        ];

        if ($request->hasFile('primary_image')) {
            $data['primary_image'] = $request->file('primary_image')->store('candidates', 'public');
        }

        if ($request->hasFile('hover_image')) {
            $data['hover_image'] = $request->file('hover_image')->store('candidates', 'public');
        }

        $candidate->update($data);

        if ($request->filled('pageant_id')) {
            $pageant->candidates()->syncWithoutDetaching($candidate->id);
        }

        return response()->json($candidate);
    }

    public function destroy(Request $request, Candidate $candidate)
    {
        if ($candidate->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $candidate->delete();

        return response()->json(['message' => 'Candidate deleted']);
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

    public function candidatePageants(Request $request, Candidate $candidate)
    {
        if ($candidate->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($candidate->pageants);
    }
}
