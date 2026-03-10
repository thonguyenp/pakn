<?php

use App\Http\Controllers\admin\DonViController;
use App\Http\Controllers\admin\NguoiDungController;
use Illuminate\Support\Facades\Route;

Route::get('donvi', [DonViController::class, 'index']);
Route::get('donvi/list', [DonViController::class, 'list']);  // checked
Route::post('donvi', [DonViController::class, 'store']);
Route::get('donvi/{id}', [DonViController::class, 'show']);
Route::put('donvi/{id}', [DonViController::class, 'update']);
Route::delete('donvi/{id}', [DonViController::class, 'destroy']);

Route::prefix('nguoidung')->group(function () {

    Route::get('/',
        [NguoiDungController::class, 'index']
    )->middleware('permission:QuanLyNguoiDung');

    Route::post('/permissions/{id}',
        [NguoiDungController::class, 'updatePermissions']
    )->middleware('permission:QuanLyQuyen');

    Route::post('/update/{id}',
        [NguoiDungController::class, 'update']
    )->middleware('permission:QuanLyNguoiDung');

    Route::get('/{id}',
        [NguoiDungController::class, 'detail']
    )->middleware('permission:QuanLyNguoiDung');

    Route::delete('/{id}',
        [NguoiDungController::class, 'delete']
    )->middleware('permission:QuanLyNguoiDung');

});
