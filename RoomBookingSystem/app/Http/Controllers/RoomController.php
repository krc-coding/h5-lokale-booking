<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class RoomController extends Controller
{
    public function getRoom(Room $room)
    {
        return new RoomResource($room);
    }

    public function getAllRooms()
    {
        return Room::all()->mapInto(RoomResource::class);
    }

    public function getRoomsAndTodayBookings()
    {
        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        $rooms = Room::with(['bookings' => function ($query) use ($today, $tomorrow) {
            $query->whereBetween('start_time', [$today, $tomorrow])
                ->orderBy('start_time', 'asc');
        }])->get();

        return view('home', compact('rooms'));
    }

    public function showRoom($id)
    {
        $room = Room::with('bookings')->findOrFail($id);
        return view('singleRoom', compact('room'));
    }

    public function createRoom(Request $request)
    {
        $user = auth()->user();
        if ($user->role !== "admin") {
            return response()->json(["message" => "Unauthorized"], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'room_number' => 'required|string|max:255',
            'max_people' => 'required|integer',
        ]);

        $room = Room::create([
            'name' => $request->name,
            'description' => $request->description,
            'room_number' => $request->room_number,
            'max_people' => $request->max_people
        ]);

        return new RoomResource($room);
    }

    public function updateRoom(Request $request, Room $room)
    {
        $user = auth()->user();
        if ($user->role !== "admin") {
            return response()->json(["message" => "Unauthorized"], 401);
        }

        $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string|max:255',
            'room_number' => 'string|max:255',
            'max_people' => 'integer',
        ]);

        if ($request->name) {
            $room->name = $request->name;
        }
        if ($request->description) {
            $room->description = $request->description;
        }
        if ($request->room_number) {
            $room->room_number = $request->room_number;
        }
        if ($request->max_people) {
            $room->max_people = $request->max_people;
        }
        $room->save();

        return new RoomResource($room);
    }

    public function deleteRoom(Room $room)
    {
        $user = auth()->user();
        if ($user->role !== "admin") {
            return response()->json(["message" => "Unauthorized"], 401);
        }

        if ($room->bookings()->exists()) {
            return response()->json(['message' => 'Room still has booking'], 409);
        }

        $room->delete();
        return response()->json([], 204);
    }
}
