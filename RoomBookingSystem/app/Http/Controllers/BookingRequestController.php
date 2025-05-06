<?php

namespace App\Http\Controllers;

use App\Models\BookingRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;

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

        return response()->json($bookingRequest, 201);
    }

    public function myReceivedRequests(Request $request)
    {
        $user = auth()->user();

        $bookingRequests = BookingRequest::with(['room'])
            ->where('user_id', $user->id)
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
