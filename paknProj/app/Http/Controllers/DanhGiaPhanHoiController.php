<?php

namespace App\Http\Controllers;

use App\Models\DanhGiaPhanHoi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DanhGiaPhanHoiController extends Controller
{
    //
    // 1. Lưu đánh giá
    public function store(Request $request)
    {
        if (! Auth::check()) {
            return response()->json([
                'message' => 'Chưa đăng nhập',
            ], 401);
        }

        $request->validate([
            'MucDoHaiLong' => 'required|integer|min:1|max:5',
            'NhanXet' => 'nullable|string',
            'IdPhanHoi' => 'required|exists:phanhoi,IdPhanHoi',
        ]);

        $userId = Auth::id();

        // Lấy IdPhanAnh + trạng thái
        $phanHoi = DB::table('phanhoi')
            ->join('phananh', 'phanhoi.IdPhanAnh', '=', 'phananh.IdPhanAnh')
            ->where('phanhoi.IdPhanHoi', $request->IdPhanHoi)
            ->select(
                'phanhoi.IdPhanHoi',
                'phanhoi.IdPhanAnh',
                'phananh.IdTrangThaiPhanAnh'
            )
            ->first();

        if (! $phanHoi) {
            return response()->json([
                'message' => 'Phản hồi không tồn tại',
            ], 404);
        }

        // Check trạng thái
        if ($phanHoi->IdTrangThaiPhanAnh != 6) {
            return response()->json([
                'message' => 'Chỉ được đánh giá khi phản ánh đã hoàn thành',
            ], 400);
        }

        // CHECK 1: chỉ được đánh giá phản hồi mới nhất
        $latestPhanHoi = DB::table('phanhoi')
            ->where('IdPhanAnh', $phanHoi->IdPhanAnh)
            ->orderByDesc('NgayPhanHoi')
            ->orderByDesc('IdPhanHoi')
            ->first();

        if (! $latestPhanHoi || $latestPhanHoi->IdPhanHoi != $request->IdPhanHoi) {
            return response()->json([
                'message' => 'Chỉ được đánh giá phản hồi mới nhất',
            ], 400);
        }

        // CHECK 2: đã đánh giá phản ánh chưa
        $daDanhGia = DB::table('danhgiaphanhoi as dg')
            ->join('phanhoi as ph', 'dg.IdPhanHoi', '=', 'ph.IdPhanHoi')
            ->where('ph.IdPhanAnh', $phanHoi->IdPhanAnh)
            ->where('dg.IdNguoiDung', $userId)
            ->exists();

        if ($daDanhGia) {
            return response()->json([
                'message' => 'Bạn đã đánh giá phản ánh này rồi',
            ], 400);
        }

        // ✅ Tạo đánh giá
        $danhGia = DanhGiaPhanHoi::create([
            'MucDoHaiLong' => $request->MucDoHaiLong,
            'NhanXet' => $request->NhanXet,
            'ThoiGian' => now(),
            'IdPhanHoi' => $request->IdPhanHoi,
            'IdNguoiDung' => $userId,
        ]);

        return response()->json([
            'message' => 'Đánh giá thành công',
            'data' => $danhGia,
        ], 201);
    }

    // 2. Lấy danh sách đánh giá theo phản hồi
    public function getByPhanHoi($idPhanHoi)
    {
        // 🔹 Lấy danh sách đánh giá
        $danhGia = DanhGiaPhanHoi::with('nguoiDung')
            ->where('IdPhanHoi', $idPhanHoi)
            ->orderByDesc('ThoiGian')
            ->get();

        $userId = Auth::id();

        $daDanhGia = false;

        // 🔥 Nếu đã login thì check theo IdPhanAnh
        if ($userId) {
            // Lấy IdPhanAnh
            $phanHoi = DB::table('phanhoi')
                ->where('IdPhanHoi', $idPhanHoi)
                ->first();

            if ($phanHoi) {
                $daDanhGia = DB::table('danhgiaphanhoi as dg')
                    ->join('phanhoi as ph', 'dg.IdPhanHoi', '=', 'ph.IdPhanHoi')
                    ->where('ph.IdPhanAnh', $phanHoi->IdPhanAnh)
                    ->where('dg.IdNguoiDung', $userId)
                    ->exists();
            }
        }

        return response()->json([
            'list' => $danhGia,
            'daDanhGia' => $daDanhGia,
        ]);
    }
}
