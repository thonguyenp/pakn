<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\NguoiDung;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

Route::middleware('auth:api')->post('/logout', function () {
    auth('api')->logout();
    return response()->json(['message' => 'Đăng xuất thành công']);
});

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