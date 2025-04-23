<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

Route::prefix('/room')->group(function () {
    Route::get('', [RoomController::class, 'getAllRooms']);
    Route::get('/{room}', [RoomController::class, 'getRoom']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/create', [RoomController::class, 'createRoom']);
        Route::put('/update/{room}', [RoomController::class, 'updateRoom']);
        Route::delete('/delete/{room}', [RoomController::class, 'deleteRoom']);
    });
});
