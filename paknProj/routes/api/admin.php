<?php

use App\Http\Controllers\admin\DonViController;
use App\Http\Controllers\admin\NguoiDungController;
use App\Http\Controllers\admin\PhanAnhController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api'])
    ->prefix('admin')
    ->group(function () {

        Route::apiResource('donvi', DonViController::class)
            ->middleware('permission:QuanLyHeThong');
        Route::prefix('phananh')->group(function () {
            Route::get('/', [PhanAnhController::class, 'index']);
            Route::get('/{id}', [PhanAnhController::class, 'show']);
            Route::put('/{id}', [PhanAnhController::class, 'update']);
            Route::delete('/{id}', [PhanAnhController::class, 'destroy'])->middleware('permission:XoaPhanAnh'); //checked 

        })->middleware('permission:XemTatCaPhanAnh');

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
