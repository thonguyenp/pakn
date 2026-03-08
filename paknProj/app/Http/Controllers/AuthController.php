<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Exceptions\JWTException;
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

        $token = JWTAuth::fromUser($user);

        return response()->json(['token' => $token], 201);
    }

    // public function login(Request $request)
    // {
    //     $credentials = $request->validate([
    //         'Email' => 'required|email',
    //         'MatKhau' => 'required|string',
    //     ]);

    //     try {
    //         if (!$token = JWTAuth::attempt(['Email' => $credentials['Email'], 'password' => $credentials['MatKhau']])) {
    //             return response()->json(['error' => 'Thông tin đăng nhập không đúng'], 401);
    //         }
    //     } catch (JWTException $e) {
    //         return response()->json(['error' => 'Không tạo được token'], 500);
    //     }

    //     return response()->json(['token' => $token]);
    // }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'Email' => 'required|email',
            'MatKhau' => 'required|string',
        ]);

        if (! $token = JWTAuth::attempt(['Email' => $credentials['Email'], 'password' => $credentials['MatKhau']])) {
            return response()->json(['error' => 'Thông tin đăng nhập không đúng'], 401);
        }

        $user = JWTAuth::setToken($token)->authenticate();
        if ($user->TrangThai !== 1) {
            JWTAuth::invalidate($token); // Hủy token nếu tài khoản bị khóa

            return response()->json(['error' => 'Tài khoản bị khóa'], 403);
        }

        return response()->json(['token' => $token]);
    }
}
