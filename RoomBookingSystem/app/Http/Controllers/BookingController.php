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

        // It finds the room and checks if it's not overlapping
        $overlap = Booking::where('room_id', $validated['room_id'])
            ->where(function ($query) use ($validated) {
                // Checks if the booking is with in one of the allready existing bookings 
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhere(function ($query) use ($validated) {
                        // Checks if the booking completely overlap another booking
                        $query->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                    });
            })
            ->exists();

        if ($overlap) {
            return response()->json(['message' => 'This time slot is already booked.'], 400);
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
