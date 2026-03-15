<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use App\Models\Quyen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class NguoiDungController extends Controller
{
    //
    public function index()
    {
        $users = NguoiDung::orderByDesc('IdNguoiDung')
            ->paginate(10);

        return response()->json($users);
    }

    public function detail($id)
    {
        $user = NguoiDung::findOrFail($id);

        // toàn bộ quyền hệ thống
        $allPermissions = Quyen::all();

        // quyền gán trực tiếp cho user
        $userPermissions = DB::table('NguoiDungQuyen')
            ->where('IdNguoiDung', $id)
            ->where('TrangThai', 1)
            ->pluck('IdQuyen');

        // lấy role của user
        $userRoles = DB::table('NguoiDungVaiTro')
            ->where('IdNguoiDung', $id)
            ->pluck('IdVaiTro');

        return response()->json([
            'user' => $user,
            'roles' => $userRoles,
            'permissions' => $allPermissions,
            'userPermissions' => $userPermissions,
        ]);
    }

    public function delete($id)
    {
        $user = NguoiDung::findOrFail($id);

        $user->TrangThai = 0;

        $user->save();

        return response()->json([
            'message' => 'User deleted',
        ]);
    }

    public function updatePermissions(Request $request, $id)
    {
        $permissions = $request->permissions;

        DB::table('NguoiDungQuyen')
            ->where('IdNguoiDung', $id)
            ->update(['TrangThai' => 0]);

        foreach ($permissions as $permissionId) {
            DB::table('NguoiDungQuyen')->updateOrInsert(
                [
                    'IdNguoiDung' => $id,
                    'IdQuyen' => $permissionId,
                ],
                [
                    'TrangThai' => 1,
                    'NgayGanQuyen' => now(),
                ]
            );
        }

        return response()->json([
            'message' => 'Cập nhật quyền thành công',
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = NguoiDung::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'HoTen' => 'required|string|max:255',
            'Email' => 'required|email|max:255|unique:NguoiDung,Email,'.$id.',IdNguoiDung',
            'SoDienThoai' => 'nullable|string|max:20',
            'MaSo' => 'nullable|string|max:50',
            'IdDonVi' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->HoTen = $request->HoTen;
        $user->Email = $request->Email;
        $user->SoDienThoai = $request->SoDienThoai;
        $user->MaSo = $request->MaSo;
        $user->IdDonVi = $request->IdDonVi;

        $user->save();

        return response()->json([
            'message' => 'Cập nhật người dùng thành công',
            'user' => $user,
        ]);
    }
}
