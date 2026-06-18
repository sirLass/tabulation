<?php

namespace App\Http\Controllers;

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
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'judge_code', 'created_at']);

        return response()->json($judges);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $code = $this->generateJudgeCode();
        $email = 'judge-' . Str::random(10) . '@pageant.local';

        $user = User::create([
            'name' => $request->name,
            'email' => $email,
            'password' => Hash::make($code),
            'role' => 'judge',
            'organization_name' => $request->user()->organization_name,
            'judge_code' => $code,
        ]);

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
            'name' => 'required|string',
            'code' => 'required|string',
        ]);

        $user = User::where('name', $request->name)
            ->where('role', 'judge')
            ->first();

        if (!$user || !Hash::check($request->code, $user->password)) {
            throw ValidationException::withMessages([
                'code' => ['Invalid judge name or code.'],
            ]);
        }

        $token = $user->createToken('judge_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    private function generateJudgeCode(): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@:';
        $code = '';
        for ($i = 0; $i < 16; $i++) {
            $code .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $code;
    }
}
