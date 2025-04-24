<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:api')->group(function () {
    Route::prefix('/user')->group(function () {
        Route::post('/createUser', [UserController::class, 'createUser']);
        Route::get('/getUser/{user}', [UserController::class, 'getUser']);
        Route::get('/getAllUsers', [UserController::class, 'getAllUsers']);
        Route::put('/editUser/{user}', [UserController::class, 'editUser']);
        Route::put('/changePassword/{user}', [UserController::class, 'changePassword']);
        Route::delete('/deleteUser/{user}', [UserController::class, 'deleteUser']);
    });
});

Route::prefix('/room')->group(function () {
    Route::get('', [RoomController::class, 'getAllRooms']);
    Route::get('/{room}', [RoomController::class, 'getRoom']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/create', [RoomController::class, 'createRoom']);
        Route::put('/update/{room}', [RoomController::class, 'updateRoom']);
        Route::delete('/delete/{room}', [RoomController::class, 'deleteRoom']);
    });
});

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
