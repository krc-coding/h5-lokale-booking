<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;

Route::get('/', [RoomController::class, 'getRoomsAndTodayBookings']);
Route::get('/userManagement', function () {
    return view('UserManagement');
});
Route::get('/rooms/{id}', [RoomController::class, 'showRoom']);

