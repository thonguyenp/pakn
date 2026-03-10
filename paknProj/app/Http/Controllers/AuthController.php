<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'HoTen' => 'required|string|max:200',
            'Email' => 'required|email|unique:NguoiDung,Email',
            'MatKhau' => 'required|string|min:6',
            'MaSo' => 'nullable|string|unique:NguoiDung,MaSo',
            'SoDienThoai' => 'nullable|string|max:15',
        ]);

        $user = NguoiDung::create([
            'HoTen' => $validated['HoTen'],
            'Email' => $validated['Email'],
            'MatKhau' => Hash::make($validated['MatKhau']),
            'MaSo' => $validated['MaSo'] ?? null,
            'SoDienThoai' => $validated['SoDienThoai'] ?? null,
            'TrangThai' => 1,
            'NgayTao' => now(),
        ]);

        // Gán role mặc định IdVaiTro = 1
        DB::table('NguoiDungVaiTro')->insert([
            'IdNguoiDung' => $user->IdNguoiDung,
            'IdVaiTro' => 1,
        ]);
        DB::table('NguoiDungQuyen')->insert([
            [
                'IdNguoiDung' => $user->IdNguoiDung,
                'IdQuyen' => 1,
                'TrangThai' => 1,
                'NgayGanQuyen' => now(),
            ],
            [
                'IdNguoiDung' => $user->IdNguoiDung,
                'IdQuyen' => 2,
                'TrangThai' => 1,
                'NgayGanQuyen' => now(),
            ],
            [
                'IdNguoiDung' => $user->IdNguoiDung,
                'IdQuyen' => 3,
                'TrangThai' => 1,
                'NgayGanQuyen' => now(),
            ],
        ]);
        // Gửi email xác thực
        // $user->sendEmailVerificationNotification();
        $user->notify(new VerifyEmail);

        $token = JWTAuth::fromUser($user);

        return response()->json(['token' => $token], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'Email' => 'required|email',
            'MatKhau' => 'required|string',
        ]);

        if (!$token = JWTAuth::attempt([
            'Email' => $credentials['Email'],
            'password' => $credentials['MatKhau'],
        ])) {
            return response()->json([
                'error' => 'Thông tin đăng nhập không đúng',
            ], 401);
        }

        $user = JWTAuth::setToken($token)->authenticate();

        if (is_null($user->email_verified_at)) {
            return response()->json([
                'error' => 'Vui lòng xác thực email trước',
            ], 403);
        }

        if ($user->TrangThai !== 1) {
            JWTAuth::invalidate($token);

            return response()->json([
                'error' => 'Tài khoản bị khóa',
            ], 403);
        }

        // LẤY QUYỀN CỦA USER
        $permissions = $user->quyens()
            ->pluck('TenQuyen');

        return response()->json([
            'token' => $token,
            'user' => $user,
            'permissions' => $permissions,
        ]);
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['Email' => 'required|email']);

        $status = Password::broker('nguoidung')->sendResetLink(
            $request->only('Email')
        );
        // logger($request->all());

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Đã gửi link đặt lại mật khẩu qua email'], 200)
            : response()->json(['error' => __($status)], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'Email' => 'required|email',
            'MatKhau' => 'required|min:6|confirmed',
        ]);

        $status = Password::broker('nguoidung')->reset(
            [
                'email' => $request->Email,
                'password' => $request->MatKhau,
                'password_confirmation' => $request->MatKhau_confirmation,
                'token' => $request->token,
            ],
            function ($user, $password) {
                $user->MatKhau = Hash::make($password);
                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Đặt lại mật khẩu thành công'], 200)
            : response()->json(['error' => __($status)], 400);
    }
}
