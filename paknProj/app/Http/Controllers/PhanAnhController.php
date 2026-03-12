<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PhanAnh;
use Illuminate\Support\Facades\Auth;

class PhanAnhController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'TieuDe' => 'required|max:300',
            'NoiDung' => 'required',
            'IdLinhVuc' => 'required',
            'IdDonVi' => 'required',
        ]);

        $phanAnh = PhanAnh::create([
            'TieuDe' => $request->TieuDe,
            'NoiDung' => $request->NoiDung,
            'MucDoKhanCap' => $request->MucDoKhanCap ?? 'THAP',
            'AnDanh' => $request->AnDanh ?? 0,
            'NgayGui' => now(),
            'IdNguoiDung' => Auth::id(),
            'IdLinhVuc' => $request->IdLinhVuc,
            'IdDonVi' => $request->IdDonVi,
            'IdTrangThaiPhanAnh' => 1
        ]);

        return response()->json([
            'message' => 'Gửi phản ánh thành công',
            'data' => $phanAnh
        ],200);
    }
}