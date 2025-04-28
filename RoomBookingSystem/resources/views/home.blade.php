@extends('layouts.app')

@section('content')
    <div class="container">
        <h1 class="mb-4">Rooms and Today's Bookings</h1>

        @foreach ($rooms as $room)
            <div class="card mb-4">
                <div class="card-header">
                    <h3>
                        <a href="{{ route('rooms.show', $room->id) }}" class="text-decoration-none">
                            {{ $room->name }}
                        </a>
                    </h3>
                </div>

                <div class="card-body">
                    @if ($room->bookings->isEmpty())
                        <p class="text-muted">No bookings for today</p>
                    @else
                        <ul class="list-group">
                            @foreach ($room->bookings as $booking)
                                <li class="list-group-item">
                                    <a href="{{ route('bookings.show', $booking->id) }}" class="text-decoration-none">
                                        {{ $booking->title }}
                                        <span class="badge bg-primary ms-2">
                                            {{ \Carbon\Carbon::parse($booking->start_time)->format('H:i') }}
                                        </span>
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    @endif
                </div>
            </div>
        @endforeach
    </div>
@endsection
