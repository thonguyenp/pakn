<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use App\Models\Quyen;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;


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

        // lấy quyền từ role
        $rolePermissions = DB::table('VaiTroQuyen')
            ->whereIn('IdVaiTro', $userRoles)
            ->pluck('IdQuyen')
            ->unique()
            ->values();

        return response()->json([
            'user' => $user,
            'roles' => $userRoles,
            'permissions' => $allPermissions,
            'rolePermissions' => $rolePermissions,
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
            'message' => 'Updated permissions',
        ]);
    }
}
