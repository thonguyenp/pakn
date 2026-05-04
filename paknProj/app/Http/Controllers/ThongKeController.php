<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class ThongKeController extends Controller
{
    //
    public function thongKeTrangThai()
    {
        $data = DB::table('phananh')
            ->join('trangthaiphananh', 'phananh.IdTrangThaiPhanAnh', '=', 'trangthaiphananh.IdTrangThaiPhanAnh')
            ->select(
                'trangthaiphananh.TenTrangThai as trang_thai',
                DB::raw('COUNT(*) as so_luong')
            )
            ->groupBy('phananh.IdTrangThaiPhanAnh', 'trangthaiphananh.TenTrangThai')
            ->get();

        return response()->json($data);
    }
}
