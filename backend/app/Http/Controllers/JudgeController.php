<?php

namespace App\Http\Controllers;

use App\Models\Pageant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class JudgeController extends Controller
{
    public function index(Request $request)
    {
        $judges = User::where('role', 'judge')
            ->where('organization_name', $request->user()->organization_name)
            ->with('pageants:id,name')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'judge_code', 'created_at']);

        return response()->json($judges);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'pageant_ids' => 'required|array',
            'pageant_ids.*' => 'exists:pageants,id',
        ]);

        $orgName = $request->user()->organization_name;

        $pageants = Pageant::whereIn('id', $request->pageant_ids)->get();
        if ($pageants->count() !== count($request->pageant_ids)) {
            return response()->json(['message' => 'One or more pageants not found.'], 404);
        }
        foreach ($pageants as $pageant) {
            if ($pageant->organization_name !== $orgName) {
                return response()->json(['message' => 'Pageant does not belong to your organization.'], 403);
            }
        }

        $code = $this->generateJudgeCode();
        $email = 'judge-' . Str::random(10) . '@pageant.local';

        $user = User::create([
            'name' => $request->name,
            'email' => $email,
            'password' => Hash::make($code),
            'role' => 'judge',
            'organization_name' => $orgName,
            'judge_code' => $code,
        ]);

        $user->pageants()->attach($request->pageant_ids);

        return response()->json([
            'judge' => [
                'id' => $user->id,
                'name' => $user->name,
                'code' => $code,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $user = User::where('judge_code', $request->code)
            ->where('role', 'judge')
            ->first();

        if (!$user || !Hash::check($request->code, $user->password)) {
            throw ValidationException::withMessages([
                'code' => ['Invalid access code.'],
            ]);
        }

        $token = $user->createToken('judge_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function destroy($id)
    {
        $user = User::where('role', 'judge')->findOrFail($id);
        $user->pageants()->detach();
        $user->delete();

        return response()->json(['message' => 'Judge removed.']);
    }

    private function generateJudgeCode(): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $code;
    }
}
