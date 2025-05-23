<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingRequestController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

Route::prefix('/user')->group(function () {
    Route::get('/teachers', [UserController::class, 'getAllTeachers']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('/createUser', [UserController::class, 'createUser']);
        Route::get('/getUser/{user}', [UserController::class, 'getUser']);
        Route::get('/getAllUsers', [UserController::class, 'getAllUsers']);
        Route::get('/getRole', [UserController::class, 'getUserRole']);
        Route::put('/editUser/{user}', [UserController::class, 'editUser']);
        Route::put('/changePassword/{user}', [UserController::class, 'changePassword']);
        Route::delete('/deleteUser/{user}', [UserController::class, 'deleteUser']);
    });
});

Route::prefix('/room')->group(function () {
    Route::get('', [RoomController::class, 'getAllRooms']);
    Route::get('/{room}', [RoomController::class, 'getRoom']);
    Route::get('/getRoomsAndTodayBookings', [RoomController::class, 'getRoomsAndTodayBookings']);
    Route::get('/showRoom/{id}', [RoomController::class, 'showRoom']);

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

Route::prefix('/group')->group(function () {
    Route::get('/getGroups', [GroupController::class, 'getGroups']);
    Route::get('/getGroupById/{group}', [GroupController::class, 'getGroupById']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/createGroup', [GroupController::class, 'createGroup']);
        Route::put('/updateGroupName/{group}', [GroupController::class, 'updateGroupName']);
        Route::put('/addRoomsToGroup/{group}', [GroupController::class, 'addRoomsToGroup']);
        Route::put('/removeRoomsFromGroup/{group}', [GroupController::class, 'removeRoomsFromGroup']);
        Route::delete('/deleteGroup/{group}', [GroupController::class, 'deleteGroup']);
    });
});

Route::prefix('/bookingRequest')->group(function () {
    Route::post('/create', [BookingRequestController::class, 'create']);
    
    Route::middleware('auth:api')->group(function () {
        Route::get('', [BookingRequestController::class, 'getAll']);
        Route::get('/received', [BookingRequestController::class, 'myReceivedRequests']);
        Route::post('/approve/{bookingRequest}', [BookingRequestController::class, 'approve']);
        Route::put('/update/{bookingRequest}', [BookingRequestController::class, 'update']);
        Route::delete('/delete/{bookingRequest}', [BookingRequestController::class, 'delete']);
    });
    Route::get('/{bookingRequest}', [BookingRequestController::class, 'getSingle']);
});

