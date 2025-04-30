<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/userManagement', function () {
    return view('UserManagement');
});
