<?php

namespace App\Jobs;

use App\Models\FileDinhKem;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\File;


class UploadFilePhanHoiJob implements ShouldQueue
{
    use Queueable;

    protected $files;
    protected $idPhanHoi;

    public function __construct($idPhanHoi, $files)
    {
        $this->idPhanHoi = $idPhanHoi;
        $this->files = $files;
    }

    public function handle()
    {
        $dataFiles = [];

        foreach ($this->files as $path) {

            $fullPath = storage_path('app/' . $path);

            $newPath = Storage::disk('public')->putFile(
                'uploads/phanhoi',
                new File($fullPath)
            );

            $dataFiles[] = [
                'TenFile' => basename($path),
                'DuongDan' => $newPath,
                'LoaiFile' => mime_content_type($fullPath),
                'KichThuoc' => filesize($fullPath),
                'NgayTaiLen' => now(),
                'IdPhanHoi' => $this->idPhanHoi,
            ];

            // xoá file temp
            unlink($fullPath);
        }

        FileDinhKem::insert($dataFiles);
    }
}