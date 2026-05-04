<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MetaController;
use App\Http\Controllers\PhanAnhController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ThongBaoController;
use App\Http\Controllers\ThongKeController;
use Illuminate\Support\Facades\Route;


// Các meta data như lĩnh vực, đơn vị, trạng thái phản ánh
Route::get('/meta', [MetaController::class, 'index']);
// Home page
Route::get('/home', [HomeController::class, 'index']);
Route::get('/thong-ke/trang-thai', [ThongKeController::class, 'thongKeTrangThai']);

// Đăng nhập và đăng ký
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
// Đăng nhập khách
Route::post('login/guest', [AuthController::class, 'guestLogin']);  // checked

// Quên mật khẩu
Route::post('forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);
Route::get('/reset-password/{token}', function ($token) {
    return redirect("http://localhost:5173/reset-password?token=$token");
})->name('password.reset');

// Email verification
Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
// Gửi lại email
Route::post('/resend-verify-email', [AuthController::class, 'resendVerifyEmail']);

// Theo dõi phản ánh mà không cần đăng nhập
Route::get('/phananh/traCuu', [PhanAnhController::class, 'traCuu']);
Route::post('/phananh/capNhat', [PhanAnhController::class, 'capNhat']);
Route::get('/phananh/public/{maTheoDoi}/{ngayGui}', [PhanAnhController::class, 'showPublic']);
Route::get('/phananh/timKiem', [PhanAnhController::class, 'timKiem']);

Route::middleware('auth:api')->group(function () {
    // Các route cần xác thực ở đây
    Route::prefix('thongbao')->group(function () {
        Route::post('/', [ThongBaoController::class, 'store']);
        Route::get('/', [ThongBaoController::class, 'index']);
        Route::post('/read/{id}', [ThongBaoController::class, 'markAsRead']);
    });
    // Nhóm service xử lý phản ánh
    Route::post('/phananh/action/{maTheoDoi}', [PhanAnhController::class, 'action'])->middleware('permission:CapNhatTrangThai');  // checked

    Route::get('/phananh/xem', [PhanAnhController::class, 'getByNguoiDung'])->middleware('permission:XemPhanAnhCuaMinh');  // checked
    Route::get('/phananh/{maTheoDoi}', [PhanAnhController::class, 'show']);

    Route::get('/phananh/donvi/', [PhanAnhController::class, 'getByDonVi'])->middleware('permission:XemPhanAnhPhong');  // checked

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
