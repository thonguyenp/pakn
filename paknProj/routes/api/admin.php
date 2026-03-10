<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\DonViController;
use App\Http\Controllers\admin\NguoiDungController;

Route::get('donvi', [DonViController::class, 'index']);
Route::get('donvi/list', [DonViController::class,'list']);  //checked
Route::post('donvi', [DonViController::class, 'store']);
Route::get('donvi/{id}', [DonViController::class, 'show']);
Route::put('donvi/{id}', [DonViController::class, 'update']);
Route::delete('donvi/{id}', [DonViController::class, 'destroy']);

Route::prefix('nguoidung')->group(function () {

    Route::get('/', [NguoiDungController::class,'index']);  //checked


    Route::post('/permissions/{id}', [NguoiDungController::class,'updatePermissions']); //checked 

    Route::post('/update/{id}', [NguoiDungController::class,'update']); //checked
    
    Route::get('/{id}', [NguoiDungController::class,'detail']); //checked

    Route::delete('/{id}', [NguoiDungController::class,'delete']);

});