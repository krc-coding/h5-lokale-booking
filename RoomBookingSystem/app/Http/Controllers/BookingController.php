<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

class BookingController extends Controller
{
    public function getAllBookings()
    {
        return Booking::all()->mapInto(BookingResource::class);
    }

    public function getByRoomId(Room $room)
    {
        return $room->bookings()->get()->mapInto(BookingResource::class);
    }

    public function getSingleById(Booking $booking)
    {
        return new BookingResource($booking);
    }

    public function createBooking(Request $request)
    {
        $user = auth()->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'string',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'room_id' => 'required|exists:rooms,id'
        ]);

        if ($request->end_time == null) {
            $validated['end_time'] = Carbon::parse($validated['start_time'])->endOfDay();
        }

        $booking = Booking::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'user_id' => $user->id,
            'room_id' => $validated['room_id'],
        ]);

        return new BookingResource($booking);
    }

    public function updateBooking(Request $request, Booking $booking)
    {
        $user = auth()->user();
        if ($user->role !== 'admin' && $user->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'title' => 'string',
            'description' => 'string',
            'start_time' => 'date',
            'end_time' => 'date',
        ]);

        $booking->title = $validated['title'] ?? $booking->title;
        $booking->description = $validated['description'] ?? $booking->description;
        $booking->start_time = $validated['start_time'] ?? $booking->start_time;
        $booking->end_time = $validated['end_time'] ?? $booking->end_time;
        $booking->save();

        return new BookingResource($booking);
    }

    public function delete(Booking $booking)
    {
        $user = auth()->user();
        if ($user->role !== 'admin' && $user->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $booking->delete();
        return response()->json([], 204);
    }
}
