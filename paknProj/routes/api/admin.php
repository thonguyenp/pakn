<?php

use App\Http\Controllers\admin\DonViController;
use App\Http\Controllers\admin\NguoiDungController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api'])
    ->prefix('admin')
    ->group(function () {

        Route::apiResource('donvi', DonViController::class)
            ->middleware('permission:QuanLyHeThong');

        Route::prefix('nguoidung')->group(function () {

            Route::get('/', [NguoiDungController::class, 'index'])
                ->middleware('permission:QuanLyNguoiDung');

            Route::get('/{id}', [NguoiDungController::class, 'detail'])
                ->middleware('permission:QuanLyNguoiDung');

            Route::post('/update/{id}', [NguoiDungController::class, 'update'])
                ->middleware('permission:QuanLyNguoiDung');

            Route::delete('/{id}', [NguoiDungController::class, 'delete'])
                ->middleware('permission:QuanLyNguoiDung');

            Route::post('/permissions/{id}',
                [NguoiDungController::class, 'updatePermissions']
            )->middleware('permission:QuanLyQuyen');

        });

    });
