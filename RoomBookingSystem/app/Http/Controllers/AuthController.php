<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    function login(Request $request)
    {
        $data = $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        if (!auth()->attempt($data)) {
            return response()->json(['error_message' => 'Incorrect username or password.'], 401);
        }

        $user = auth()->user();

        if ($user->disabled) {
            return response()->json(['error_message' => 'Incorrect username or password.'], 401);
        }

        $token = $user->createToken('API Token')->accessToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout()
    {
        $user = auth()->user();
        self::logoutUser($user);
    }
    
    public static function logoutUser(User $user) {
        $userTokens = $user->tokens;
        foreach ($userTokens as $token) {
            $token->revoke();
        }
    }
}
