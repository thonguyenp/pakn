<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfileController extends Controller
{
    //
    public function getProfile()
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'HoTen' => $user->HoTen,
            'Email' => $user->Email,
            'SoDienThoai' => $user->SoDienThoai,
            'MaSo' => $user->MaSo,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $data = $request->validate([
            'HoTen' => 'required|string|max:255',
            'SoDienThoai' => 'nullable|string|max:20',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Cập nhật thành công',
            'user' => $user,
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $data = $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        if (!Hash::check($data['old_password'], $user->MatKhau)) {
            return response()->json([
                'message' => 'Mật khẩu cũ không đúng',
            ], 400);
        }

        $user->MatKhau = Hash::make($data['new_password']);
        $user->save();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công',
        ]);
    }
}
