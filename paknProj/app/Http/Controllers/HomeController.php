<?php

namespace App\Http\Controllers;

use App\Models\LinhVuc;
use App\Models\PhanAnh;

class HomeController extends Controller
{
    //
    public function index()
    {
        // ===== 1. Phản ánh nổi bật (4 mới nhất)
        $phanAnhNoiBat = PhanAnh::with(['linhVuc', 'donVi', 'trangThaiPhanAnh'])
            ->orderBy('NgayGui', 'desc')
            ->limit(4)
            ->where('IdTrangThaiPhanAnh', 6)
            ->get();

        // ===== 2. Lấy tất cả lĩnh vực
        $linhVucs = LinhVuc::all();

        // ===== 3. Với mỗi lĩnh vực -> lấy 4 phản ánh mới nhất
        $phanAnhTheoLinhVuc = [];

        foreach ($linhVucs as $linhVuc) {
            $phanAnhs = PhanAnh::with(['linhVuc', 'donVi', 'trangThaiPhanAnh'])
                ->where('IdLinhVuc', $linhVuc->IdLinhVuc)
                ->orderBy('NgayGui', 'desc')
                ->limit(4)
                ->where('IdTrangThaiPhanAnh', 6)
                ->get();

            $phanAnhTheoLinhVuc[] = [
                'linh_vuc' => $linhVuc,
                'phan_anhs' => $phanAnhs,
            ];
        }

        // ===== 4. Return JSON
        return response()->json([
            'phan_anh_noi_bat' => $phanAnhNoiBat,
            'phan_anh_theo_linh_vuc' => $phanAnhTheoLinhVuc,
        ]);
    }
}
