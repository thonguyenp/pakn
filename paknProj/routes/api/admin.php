<?php

use App\Http\Controllers\admin\DonViController;
use App\Http\Controllers\admin\FileDinhKemController;
use App\Http\Controllers\admin\NguoiDungController;
use App\Http\Controllers\admin\PhanAnhController;
use App\Http\Controllers\admin\SmtpController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api'])
    ->prefix('admin')
    ->group(function () {

        Route::prefix('donvi')
            ->middleware('permission:QuanLyHeThong')
            ->group(function () {

                Route::get('/', [DonViController::class, 'index']);
                Route::get('/list', [DonViController::class, 'list']);
                Route::get('/{id}', [DonViController::class, 'show']);
                Route::post('/', [DonViController::class, 'store']);
                Route::put('/{id}', [DonViController::class, 'update']);
                Route::delete('/{id}', [DonViController::class, 'destroy']);

            });

        Route::prefix('phananh')
            ->middleware('permission:XemTatCaPhanAnh')
            ->group(function () {

                Route::get('/', [PhanAnhController::class, 'index']);
                Route::get('/{id}', [PhanAnhController::class, 'show']);
                Route::put('/{id}', [PhanAnhController::class, 'update']);
                Route::delete('/{id}', [PhanAnhController::class, 'destroy'])
                    ->middleware('permission:XoaPhanAnh');

                Route::get('/files/{id}', [FileDinhKemController::class, 'getByPhanAnh']);

            });

        Route::prefix('nguoidung')
            ->middleware('permission:QuanLyNguoiDung')
            ->group(function () {

                Route::get('/', [NguoiDungController::class, 'index']);
                Route::get('/{id}', [NguoiDungController::class, 'detail']);
                Route::post('/update/{id}', [NguoiDungController::class, 'update']);
                Route::delete('/{id}', [NguoiDungController::class, 'delete']);

                Route::post('/permissions/{id}',
                    [NguoiDungController::class, 'updatePermissions']
                )->middleware('permission:QuanLyQuyen');

            });
        Route::prefix('smtp')->group(function () {
            Route::post('/save', [SmtpController::class, 'save']);
            Route::get('/', [SmtpController::class, 'get']);
            Route::post('/test', [SmtpController::class, 'sendTest']);
        })->middleware('permission:QuanLyHeThong');
});
