<?php

use App\Http\Controllers\admin\DonViController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MetaController;
use App\Http\Controllers\PhanAnhController;
use App\Http\Controllers\ProfileController;
use App\Models\NguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Các meta data như lĩnh vực, đơn vị, trạng thái phản ánh
Route::get('/meta', [MetaController::class, 'index']);

// Route::get('donvi', [DonViController::class, 'index']);  // checked

// Đăng nhập và đăng ký
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
// Đăng nhập khách
Route::post('login/guest', [AuthController::class, 'guestLogin']);  // checked

// Quên mật khẩu
Route::post('password/email', [AuthController::class, 'sendResetLinkEmail']);
Route::post('password/reset', [AuthController::class, 'resetPassword']);

Route::get('/reset-password/{token}', function ($token) {
    return redirect("http://localhost:5173/reset-password?token=$token");
})->name('password.reset');

// Email verification
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = NguoiDung::findOrFail($id);

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return redirect('http://localhost:5173/login?verify=invalid');
    }

    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    return redirect('http://localhost:5173/login?verify=success');
})->middleware('signed')->name('verification.verify');

// Theo dõi phản ánh mà không cần đăng nhập
Route::get('/phananh/theodoi/{maTheoDoi}', [PhanAnhController::class, 'theoDoi'])->middleware('guest.auth');

Route::middleware('auth:api')->group(function () {
    // Các route cần xác thực ở đây

    Route::get('/phananh/xem', [PhanAnhController::class, 'getByNguoiDung'])->middleware('permission:XemPhanAnhCuaMinh');  // checked

    Route::get('/phananh/donvi/', [PhanAnhController::class, 'getByDonVi'])->middleware('permission:XemPhanAnhPhong');  // checked
    Route::get('/phananh/{id}', [PhanAnhController::class, 'show']);

    Route::get('/profile', [ProfileController::class, 'getProfile']);   // checked

    Route::put('/profile', [ProfileController::class, 'updateProfile']);    // checked

    Route::post('/doi-mat-khau', [ProfileController::class, 'changePassword']);  // checked

    // Đăng xuất
    Route::post('/logout', function () {
        auth('api')->logout();

        return response()->json(['message' => 'Đăng xuất thành công']);
    });

});

Route::post('/phananh', [PhanAnhController::class, 'store'])
    ->middleware('guest.auth');  // checked
