<?php

namespace App\Http\Controllers;

use App\Models\Criterion;
use App\Models\Pageant;
use Illuminate\Http\Request;

class CriteriaController extends Controller
{
    public function index(Pageant $pageant)
    {
        $pageant = Pageant::where('user_id', request()->user()->id)->findOrFail($pageant->id);
        return response()->json($pageant->criteria);
    }

    public function store(Request $request, Pageant $pageant)
    {
        $pageant = Pageant::where('user_id', $request->user()->id)->findOrFail($pageant->id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'percentage' => 'required|integer|min:1|max:100',
        ]);

        $currentTotal = $pageant->criteria()->sum('percentage');
        if ($currentTotal + $validated['percentage'] > 100) {
            return response()->json(['message' => 'Total percentage cannot exceed 100%. Remaining: ' . (100 - $currentTotal) . '%'], 422);
        }

        $criterion = $pageant->criteria()->create($validated);
        return response()->json($criterion, 201);
    }

    public function show(Criterion $criterion)
    {
        Pageant::where('user_id', request()->user()->id)->findOrFail($criterion->pageant_id);
        return response()->json($criterion);
    }

    public function update(Request $request, Criterion $criterion)
    {
        $pageant = Pageant::where('user_id', $request->user()->id)->findOrFail($criterion->pageant_id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'percentage' => 'sometimes|integer|min:1|max:100',
        ]);

        if (isset($validated['percentage'])) {
            $currentTotal = $pageant->criteria()->where('id', '!=', $criterion->id)->sum('percentage');
            if ($currentTotal + $validated['percentage'] > 100) {
                return response()->json(['message' => 'Total percentage cannot exceed 100%. Remaining: ' . (100 - $currentTotal) . '%'], 422);
            }
        }

        $criterion->update($validated);
        return response()->json($criterion);
    }

    public function destroy(Criterion $criterion)
    {
        Pageant::where('user_id', request()->user()->id)->findOrFail($criterion->pageant_id);
        $criterion->delete();
        return response()->json(['message' => 'Criterion deleted']);
    }
}
