<?php

namespace App\Http\Controllers;

use App\Models\Pageant;
use Illuminate\Http\Request;

class PageantController extends Controller
{
    public function index(Request $request)
    {
        $pageants = Pageant::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        return response()->json($pageants);
    }

    public function publicIndex()
    {
        $pageants = Pageant::orderBy('created_at', 'desc')->paginate(10);
        return response()->json($pageants);
    }

    public function show($id)
    {
        $pageant = Pageant::with('candidates')->findOrFail($id);
        return response()->json($pageant);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $pageant = Pageant::create([
            'user_id' => $request->user()->id,
            'organization_name' => $request->user()->organization_name,
            ...$validated,
        ]);

        return response()->json($pageant, 201);
    }
}
