<?php

namespace App\Http\Controllers;

use App\Models\FileDinhKem;
use App\Models\PhanAnh;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

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
            'IdTrangThaiPhanAnh' => 1,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {

                $path = $file->store('phananh', 'public');

                FileDinhKem::create([
                    'TenFile' => $file->getClientOriginalName(),
                    'DuongDan' => $path,
                    'LoaiFile' => $file->getMimeType(),
                    'KichThuoc' => $file->getSize(),
                    'NgayTaiLen' => now(),
                    'IdPhanAnh' => $phanAnh->IdPhanAnh,
                ]);
            }
        }

        return response()->json([
            'message' => 'Gửi phản ánh thành công',
            'data' => $phanAnh,
        ], 200);
    }

    // Lấy phản ánh theo IdNguoiDung
    public function getByNguoiDung()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $idNguoiDung = $user->IdNguoiDung;
        
        $phanAnhs = PhanAnh::where('IdNguoiDung', $idNguoiDung)
            ->with('files')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $phanAnhs,
        ]);
    }

    // Lấy phản ánh theo IdDonVi
    public function getByDonVi()
    {
        // Lấy user đang đăng nhập từ token
        $user = JWTAuth::parseToken()->authenticate();

        // Lấy IdDonVi của user
        $idDonVi = $user->IdDonVi;

        // Lấy các phản ánh thuộc đơn vị đó
        $phanAnhs = PhanAnh::where('IdDonVi', $idDonVi)
            ->with('files')
            ->orderBy('NgayGui', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'IdDonVi' => $idDonVi,
            'data' => $phanAnhs,
        ]);
    }
}
