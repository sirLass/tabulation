<?php

namespace App\Http\Controllers;

use App\Models\Segment;
use App\Models\Pageant;
use Illuminate\Http\Request;

class SegmentController extends Controller
{
    public function index(Pageant $pageant)
    {
        $pageant = Pageant::where('user_id', request()->user()->id)->findOrFail($pageant->id);
        return response()->json($pageant->segments);
    }

    public function store(Request $request, Pageant $pageant)
    {
        $pageant = Pageant::where('user_id', $request->user()->id)->findOrFail($pageant->id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:Preliminary Segment,Semi-Final Segment,Final Segment',
        ]);

        $segment = $pageant->segments()->create([
            'name' => $validated['name'],
            'type' => $validated['type'],
        ]);
        return response()->json($segment, 201);
    }

    public function show(Segment $segment)
    {
        Pageant::where('user_id', request()->user()->id)->findOrFail($segment->pageant_id);
        return response()->json($segment);
    }

    public function update(Request $request, Segment $segment)
    {
        Pageant::where('user_id', $request->user()->id)->findOrFail($segment->pageant_id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:Preliminary Segment,Semi-Final Segment,Final Segment',
        ]);

        $segment->update($validated);
        return response()->json($segment);
    }

    public function destroy(Segment $segment)
    {
        Pageant::where('user_id', request()->user()->id)->findOrFail($segment->pageant_id);
        $segment->delete();
        return response()->json(['message' => 'Segment deleted']);
    }
}
