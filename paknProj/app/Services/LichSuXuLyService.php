<?php

namespace App\Services;

use App\Models\LichSuXuLy;
use Illuminate\Support\Facades\Auth;

class LichSuXuLyService
{
    public static function ghi(
        string $hanhDong,
        ?string $ghiChu = null,
        ?int $idPhanAnh = null,
        ?int $idNguoiDung = null,
        ?string $loai = null
    ) {
        LichSuXuLy::create([
            'HanhDong' => $hanhDong,
            'GhiChu' => $ghiChu,
            'ThoiGian' => now(),
            'IdPhanAnh' => $idPhanAnh,
            'IdNguoiDung' => $idNguoiDung ?? Auth::id(),
            'Loai' => $loai,
        ]);
    }
}