<?php

namespace App\Services;

use App\Models\FileDinhKem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    public function handle($modelType, $modelId, $filesData)
    {
        $dataToInsert = [];

        foreach ($filesData as $file) {

            $extension = pathinfo($file['original_name'], PATHINFO_EXTENSION);
            $newName = Str::uuid().'.'.$extension;

            $newPath = strtolower($modelType).'/'.$modelId.'/'.$newName;

            // move từ temp → chính
            Storage::disk('public')->move($file['temp_path'], $newPath);

            $dataToInsert[] = 
            [
                'TenFile'    => $file['original_name'],
                'DuongDan'   => $newPath,
                'LoaiFile'   => $extension,
                'KichThuoc'  => $file['size'] ?? null,
                'NgayTaiLen' => now(), 
                'IdPhanHoi' => $modelId,
            ];
        }

        FileDinhKem::insert($dataToInsert);
    }
}
