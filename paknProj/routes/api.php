<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DonViController;
use Illuminate\Support\Facades\Auth;

Route::get('donvi', [DonViController::class, 'index']);
Route::post('donvi', [DonViController::class, 'store']);
Route::get('donvi/{id}', [DonViController::class, 'show']);
Route::put('donvi/{id}', [DonViController::class, 'update']);
Route::delete('donvi/{id}', [DonViController::class, 'destroy']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->post('/logout', function () {
    auth('api')->logout();
    return response()->json(['message' => 'Đăng xuất thành công']);
});