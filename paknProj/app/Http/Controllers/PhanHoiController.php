<?php

namespace App\Http\Controllers;

use App\Jobs\UploadFilePhanHoiJob;
use App\Models\PhanHoi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PhanHoiController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'NoiDung' => 'required|string',
            'IdPhanAnh' => 'required|exists:phananh,IdPhanAnh',
            'files' => 'array|max:5',
            'files.*' => 'file|max:10240',
        ]);

        DB::beginTransaction();

        try {
            $phanHoi = PhanHoi::create([
                'NoiDung' => $request->NoiDung,
                'LaNoiBo' => $request->LaNoiBo ?? 0,
                'NgayPhanHoi' => now(),
                'IdPhanAnh' => $request->IdPhanAnh,
                'IdNguoiDung' => $request->IdNguoiDung ?? null,
            ]);

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['error' => $e->getMessage()], 500);
        }

        // Đẩy vào queue
        $tempPaths = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $tempPaths[] = $file->store('temp');
            }

            UploadFilePhanHoiJob::dispatch(
                $phanHoi->IdPhanHoi,
                $tempPaths
            );
        }

        return response()->json([
            'message' => 'Tạo phản hồi thành công (đang upload file nền)',
            'data' => $phanHoi,
        ]);
    }
}
