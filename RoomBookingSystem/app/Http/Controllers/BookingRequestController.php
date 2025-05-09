<?php

namespace App\Http\Controllers;

use App\Models\BookingRequest;
use App\Models\Booking;
use App\Http\Controllers\BookingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BookingRequestController extends Controller
{
    public function getAll()
    {
        $user = auth()->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $bookingRequests = BookingRequest::with(['user', 'room'])->get();
        return response()->json($bookingRequests);
    }

    public function Create(Request $request)
    {
        $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'start_time' => 'required|date',
        'end_time' => 'required|date|after:start_time',
        'room_id' => 'required|exists:rooms,id',
        'student_name' => 'required|string|max:255',
        'user_id' => 'required|exists:users,id', // The recipient
        ]);

        $bookingRequest = BookingRequest::create($validated);

        return response()->json(['status' => 'ok'], 200);
    }

    public function approve(Request $request, BookingRequest $bookingRequest)
    {
        $user = auth()->user();
    
        if ($user->id !== $bookingRequest->user_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
    
        $start = $bookingRequest->start_time;
        $end = $bookingRequest->end_time ?? Carbon::parse($start)->endOfDay();
    
        // Check for overlap
        $overlap = Booking::where('room_id', $bookingRequest->room_id)
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('start_time', [$start, $end])
                    ->orWhereBetween('end_time', [$start, $end])
                    ->orWhere(function ($query) use ($start, $end) {
                        $query->where('start_time', '<=', $start)
                              ->where('end_time', '>=', $end);
                    });
            })
            ->exists();
        
        if ($overlap) {
            return response()->json(['message' => 'This time slot is already booked.'], 400);
        }
    
        // Create the booking
        $booking = new Booking([
            'title' => $bookingRequest->title,
            'description' => $bookingRequest->description,
            'start_time' => $start,
            'end_time' => $end,
            'room_id' => $bookingRequest->room_id,
        ]);
        $booking->user_id = $user->id;
        $booking->save();
    
        $bookingRequest->delete();
    
        return response()->json(['message' => 'Booking approved.']);
    }



    public function myReceivedRequests()
    {
        $user = auth()->user();

        $bookingRequests = BookingRequest::with(['room'])
            ->where('user_id', $user->id)
            ->where('end_time', '>', now())
            ->get();

        return response()->json($bookingRequests);
    }


    public function getSingle(BookingRequest $bookingRequest)
    {
        $bookingRequest->load(['user', 'room']);
        return response()->json($bookingRequest);
    }

    public function update(Request $request, BookingRequest $bookingRequest)
    {
        $user = auth()->user();
        if ($user->role !== 'admin' && $user->role !== 'teacher') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:start_time',
            'room_id' => 'sometimes|exists:rooms,id',
            'student_name' => 'sometimes|string|max:255',
        ]);

        $bookingRequest->update($validated);

        return response()->json($bookingRequest);
    }

    public function delete(BookingRequest $bookingRequest)
    {
        $user = auth()->user();
        if ($user->role !== 'admin' && $user->role !== 'teacher') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $bookingRequest->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
