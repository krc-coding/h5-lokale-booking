<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\Room;

class GroupController extends Controller
{
    public function getGroups()
    {
        return Group::with('rooms')->get();
    }

    public function getGroupById(Group $group)
    {
        $group = Group::with('rooms')->find($group->$id);

        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        return response()->json($group, 200);
    }

    public function createGroup(Request $request)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'room_ids' => 'array',
            'room_ids.*' => 'exists:rooms,id'
        ]);

        $group = Group::create([
            'name' => $validated['name'],
        ]);

        if (!empty($validated['room_ids'])) {
            $group->rooms()->sync($validated['room_ids']);
        }

        return response()->json($group->load('rooms'), 201);
    }

    public function updateGroupName(Request $request, Group $group)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $group->update(['name' => $validated['name']]);

        return response()->json($group->load('rooms'), 200);
    }

    public function addRoomsToGroup(Request $request, Group $group)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'room_ids' => 'required|array',
            'room_ids.*' => 'exists:rooms,id',
        ]);

        $group->rooms()->syncWithoutDetaching($validated['room_ids']);

        return response()->json($group->load('rooms'), 200);
    }

    public function removeRoomsFromGroup(Request $request, Group $group)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'room_ids' => 'required|array',
            'room_ids.*' => 'exists:rooms,id',
        ]);

        $group->rooms()->detach($validated['room_ids']);

        return response()->json(['message' => 'Rooms removed from group'], 200);
    }

    public function deleteGroup(Group $group)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $group->rooms()->detach();
        $group->delete();

        return response()->json(['message' => 'Group deleted'], 200);
    }
}

