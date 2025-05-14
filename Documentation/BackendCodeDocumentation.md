# Code documentation (Kasper K)

*This documents some of the more complex/interesting parts of the backend*

## Prerequisites

The code docs are written, with the assumption of some basic knowlegde in the following area:

* Php

## Booking controller

The code for the following can be found in `RoomBookingSystem\app\Http\Controllers\BookingController.php`.

### Create booking

First it make sure what it is a admin or teacher there is logged in.
Then validates it all the data, end_time is nullable if it is set it to the end of the day.
Then it checks if the room is booked in the time the new booking is.
Returns the new booking if successful else a message.

```php 
public function createBooking(Request $request)
{
    $user = auth()->user();
    if ($user->role !== 'admin' && $user->role !== 'teacher') {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $validated = $request->validate([
        'title' => 'required|string',
        'description' => 'nullable|string',
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
```

## Group controller

The code for the following can be found in `RoomBookingSystem\app\Http\Controllers\GroupController.php`.

### Create group

You can send an array of room ids and after creating the group making the ralation.

```php
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
```

## Room controller

The code for the following can be found in `RoomBookingSystem\app\Http\Controllers\RoomController.php`.

### Show room

Take a room id and find the room, returns the html from: `RoomBookingSystem\resources\views\singleRoom.blade.php`, after running all the php code.

```php
public function showRoom($id)
{
    $room = Room::with('bookings')->findOrFail($id);
    return view('singleRoom', compact('room'));
}
```

### Delete room

Check user as only admin can delete.
Then if there are booking to the room it can't delete.
Returns an empty json.

```php
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
```

## Api routes

The code for the following can be found in `RoomBookingSystem\routes\api.php`.

### Routes

The prefix make all routes below have that syntax, in this case: `baseUrl/api/booking`.

Middleware are where you need to have a valid bearer token, it doesn't change url.

The first string is the final part of the url.
Next comes the class, it tells witch class where the function in the second string.

```php
Route::prefix('booking')->group(function () {
    Route::get('', [BookingController::class, 'getAllBookings']);
    Route::get('/{booking}', [BookingController::class, 'getSingleById']);
    Route::get('/room/{room}', [BookingController::class, 'getByRoomId']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/create', [BookingController::class, 'createBooking']);
        Route::put('/update/{booking}', [BookingController::class, 'updateBooking']);
        Route::delete('delete/{booking}', [BookingController::class, 'delete']);
    });
});
```

## Resources

The code for the following can be found in `RoomBookingSystem\app\Http\Resources\BookingResource.php`.

This is what you want to you if want to filter in the data you want to send the user, this make an 1 to 1 of the data. 

```php
public function toArray(Request $request): array
{
    return parent::toArray($request);
}
```

This is an example on what you can do with a Booking:

```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'title' => $this->title,
        'description' => $this->description,
    ];
}
```

## Migraions

### Group and room ralation table

The code for the following can be found in `RoomBookingSystem\database\migrations\2025_04_23_062905_create_rooms_groups_table.php`.

It makes two rows with an foreign key.

```php
public function up(): void
{
    Schema::create('group_room', function (Blueprint $table) {
        $table->foreignId('group_id')->constrained();
        $table->foreignId('room_id')->constrained();
    });
}
```

### Default user

The code for the following can be found in `RoomBookingSystem\database\migrations\2025_05_06_063628_create_system_admin_user.php`.

This is the system admin creation and the only place where a user can get an other role then Admin and Teacher.

```php
public function up(): void
{
    $user = User::find(1);
    if (!$user) {
        User::create([
            'id' => 1,
            'username' => 'System Admin',
            'password' => Hash::make('Merc1234!'),
            'role' => 'systemAdmin',
        ]);
    }
}
```
