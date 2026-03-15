<?php

use App\Http\Controllers\admin\DonViController;
use App\Http\Controllers\admin\FileDinhKemController;
use App\Http\Controllers\admin\NguoiDungController;
use App\Http\Controllers\admin\PhanAnhController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api'])
    ->prefix('admin')
    ->middleware('permission:QuanLyHeThong')
    ->group(function () {

        Route::prefix('donvi')->middleware('permission:QuanLyHeThong')->group(function () {
            Route::get('/', [DonViController::class, 'index'])          // danh sách phân trang
                ->name('donvi.index');

            Route::get('/list', [DonViController::class, 'list'])      // toàn bộ active (no paginate)
                ->name('donvi.list');

            Route::get('/{id}', [DonViController::class, 'show'])
                ->name('donvi.show');

            Route::post('/', [DonViController::class, 'store'])
                ->name('donvi.store');

            Route::put('/{id}', [DonViController::class, 'update'])
                ->name('donvi.update');

            Route::delete('/{id}', [DonViController::class, 'destroy'])
                ->name('donvi.destroy');

        });

        Route::prefix('phananh')->group(function () {
            Route::get('/', [PhanAnhController::class, 'index']);
            Route::get('/{id}', [PhanAnhController::class, 'show']);
            Route::put('/{id}', [PhanAnhController::class, 'update']);
            Route::delete('/{id}', [PhanAnhController::class, 'destroy'])->middleware('permission:XoaPhanAnh'); // checked
            Route::get('/files/{id}', [FileDinhKemController::class, 'getByPhanAnh']);
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
