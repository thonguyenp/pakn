<?php

namespace App\Http\Controllers;

use App\Models\DonVi;
use App\Models\LinhVuc;

class MetaController extends Controller
{
    public function getLinhVuc()
    {
        $data = LinhVuc::select('IdLinhVuc', 'TenLinhVuc')->get();

        return response()->json($data);
    }

    public function getDonVi()
    {
        $data = DonVi::select('IdDonVi', 'TenDonVi')->get();

        return response()->json($data);
    }
}
