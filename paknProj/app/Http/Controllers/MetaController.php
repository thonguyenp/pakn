<?php

namespace App\Http\Controllers;

use App\Models\DonVi;
use App\Models\LinhVuc;
use App\Models\TrangThaiPhanAnh;
use Illuminate\Http\Request;

class MetaController extends Controller
{
    // public function getLinhVuc()
    // {
    //     $data = LinhVuc::select('IdLinhVuc', 'TenLinhVuc')->get();

    //     return response()->json($data);
    // }

    // public function getDonVi()
    // {
    //     $data = DonVi::select('IdDonVi', 'TenDonVi')->get();

    //     return response()->json($data);
    // }

    // public function getTrangThaiPhanAnh()
    // {
    //     $data = TrangThaiPhanAnh::select('IdTrangThaiPhanAnh', 'TenTrangThai')->get();

    //     return response()->json($data);
    // }
        public function index(Request $request)
    {
        // lấy query include
        $include = $request->query('include');

        // chuyển thành array
        $include = $include ? explode(',', $include) : [];

        $data = [];

        if (in_array('linhvuc', $include)) {
            $data['linhvuc'] = LinhVuc::select(
                'IdLinhVuc',
                'TenLinhVuc'
            )->orderBy('TenLinhVuc')->get();
        }

        if (in_array('donvi', $include)) {
            $data['donvi'] = DonVi::select(
                'IdDonVi',
                'TenDonVi'
            )->orderBy('TenDonVi')->get();
        }

        if (in_array('trangthai', $include)) {
            $data['trangthai'] = TrangThaiPhanAnh::select(
                'IdTrangThaiPhanAnh',
                'TenTrangThai'
            )->orderBy('IdTrangThaiPhanAnh')->get();
        }

        return response()->json($data);
    }

}
