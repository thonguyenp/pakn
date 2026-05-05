<?php

namespace App\Http\Controllers;

use App\Models\DanhGiaPhanHoi;
use Illuminate\Http\Request;

class DanhGiaPhanHoiController extends Controller
{
    //
        // 1. Lưu đánh giá
    public function store(Request $request)
    {
        $request->validate([
            'MucDoHaiLong' => 'required|integer|min:1|max:5',
            'NhanXet' => 'nullable|string',
            'IdPhanHoi' => 'required|exists:phanhoi,IdPhanHoi',
            'IdNguoiDung' => 'required|exists:nguoidung,IdNguoiDung',
        ]);

        $danhGia = DanhGiaPhanHoi::create([
            'MucDoHaiLong' => $request->MucDoHaiLong,
            'NhanXet' => $request->NhanXet,
            'ThoiGian' => now(),
            'IdPhanHoi' => $request->IdPhanHoi,
            'IdNguoiDung' => $request->IdNguoiDung,
        ]);

        return response()->json([
            'message' => 'Đánh giá thành công',
            'data' => $danhGia
        ], 201);
    }

    // 2. Lấy danh sách đánh giá theo phản hồi
    public function getByPhanHoi($idPhanHoi)
    {
        $danhGia = DanhGiaPhanHoi::with('nguoiDung')
            ->where('IdPhanHoi', $idPhanHoi)
            ->orderByDesc('ThoiGian')
            ->get();

        return response()->json($danhGia);
    }

}
