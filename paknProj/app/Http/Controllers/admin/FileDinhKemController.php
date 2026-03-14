<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\FileDinhKem;

class FileDinhKemController extends Controller
{
    //
    public function getByPhanAnh($id)
    {
        $files = FileDinhKem::where('IdPhanAnh', $id)->get();

        if ($files->isEmpty()) {
            return response()->json([
                'message' => 'Không có file đính kèm',
            ], 404);
        }

        return response()->json($files);
    }
}
