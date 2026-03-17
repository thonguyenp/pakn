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

    private function buildQuery(Request $request, $field, $value)
    {
        return PhanAnh::where($field, $value)
            ->when($request->MucDoKhanCap, function ($query) use ($request) {
                $query->where('MucDoKhanCap', $request->MucDoKhanCap);
            })
            ->when($request->IdTrangThaiPhanAnh, function ($query) use ($request) {
                $query->where('IdTrangThaiPhanAnh', $request->IdTrangThaiPhanAnh);
            })
            ->when($request->AnDanh !== null, function ($query) use ($request) {
                $query->where('AnDanh', $request->AnDanh);
            })
            ->with('files')
            ->orderBy('NgayGui', 'desc');
    }

    public function getByNguoiDung(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $phanAnhs = $this
            ->buildQuery($request, 'IdNguoiDung', $user->IdNguoiDung)
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $phanAnhs,
        ]);
    }

    public function getByDonVi(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $phanAnhs = $this
            ->buildQuery($request, 'IdDonVi', $user->IdDonVi)
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $phanAnhs,
        ]);
    }

    public function show($id)
    {
        // Chỉ lấy phản ánh nếu user là người tạo hoặc thuộc đơn vị được giao
        $user = JWTAuth::parseToken()->authenticate();

        $phanAnh = PhanAnh::with('files')
            ->where('IdPhanAnh', $id)
            ->where(function ($query) use ($user) {
                $query->where('IdNguoiDung', $user->IdNguoiDung)
                    ->orWhere('IdDonVi', $user->IdDonVi);
            })
            ->first();

        if (!$phanAnh) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phản ánh',
            ], 404);
        }

        foreach ($phanAnh->files as $file) {
            $file->url = asset('storage/'.$file->DuongDan);
        }

        return response()->json([
            'success' => true,
            'data' => $phanAnh,
        ]);
    }
}
