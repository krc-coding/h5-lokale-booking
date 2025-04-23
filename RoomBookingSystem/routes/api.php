<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

Route::prefix('/user')->group(function () {
    Route::middleware('auth:api')->group(function () {
        Route::post('/createUser', [UserController::class, 'createUser']);
        Route::get('/getUser/{user}', [UserController::class, 'getUser']);
        Route::get('/getAllUsers', [UserController::class, 'getAllUsers']);
        Route::put('/editUser/{user}', [UserController::class, 'editUser']);
        Route::put('/changePassword/{user}', [UserController::class, 'changePassword']);
        Route::delete('/deleteUser/{user}', [UserController::class, 'deleteUser']);

    });
});
