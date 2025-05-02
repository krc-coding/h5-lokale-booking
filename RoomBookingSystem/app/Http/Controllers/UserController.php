<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function getAllUsers()
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $users = User::all();
        return response()->json($users);
    }

    public function getUser(user $user)
    {
        $authUser = auth()->user();

        if ($authUser->role !== 'admin' && $authUser->id != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response(['user' => $user]);
    }

    public function getUserRole()
    {
        $authUser = auth()->user();
        return response()->json(['role' => $authUser->role]);
    }

    public function createUser(Request $request)
    {
        $authUser = auth()->user();

        if ($authUser->role !== 'admin' && $authUser->role !== 'systemAdmin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|string|in:teacher,admin,',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    public function editUser(user $user, Request $request)
    {
        $authUser = auth()->user();

        if ($authUser->role !== 'admin' && $authUser->role !== 'systemAdmin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'disabled' => 'boolean',
            'role' => 'string|in:teacher,admin',
        ]);

        $user->disabled = $validated['disabled'] ?? $user->disabled;
        if ($user->role !== 'systemAdmin') {
            $user->role = $validated['role'] ?? $user->role;
        }

        $user->save();
        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    public function changePassword(user $user, Request $request)
    {
        $authUser = auth()->user();

        if ($authUser->role !== 'admin' && $authUser->role !== 'systemAdmin' && $authUser->id != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'oldPassword' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($request->oldPassword, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json(['message' => 'Password changed successfully', 'user' => $user], 200);
    }

    public function deleteUser(user $user)
    {
        $authUser = auth()->user();

        if ($authUser->role !== 'admin' && $authUser->role !== 'systemAdmin' || $authUser->id == $user->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($user->role == 'systemAdmin') {
            return response()->json(['message' => 'System admin cannot be deleted but only dissabled'], 401);
        }

        $user->delete();

        return response()->json([], 204);
    }
}
