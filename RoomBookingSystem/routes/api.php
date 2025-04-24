<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
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

Route::prefix('/group')->group(function () {
    Route::get('/getGroups', [GroupController::class, 'getGroups']);
    Route::get('/getGroupById/{group}', [GroupController::class, 'getGroupById']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('/createGroup', [GroupController::class, 'createGroup']);
        Route::put('/updateGroup/{group}', [GroupController::class, 'updateGroup']);
        Route::put('/deleteGroup/{group}', [GroupController::class, 'deleteGroup']);
    });
});
