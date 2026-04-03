<?php

namespace App\Services;

use App\Models\FileDinhKem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    protected $modelColumnMap = ['phanhoi' => 'IdPhanHoi', 'phananh' => 'IdPhanAnh'];

    public function handle($modelType, $modelId, $filesData)
    {
        $dataToInsert = [];
        $modelType = strtolower($modelType);
        if (! isset($this->modelColumnMap[$modelType])) {
            throw new \Exception("Model type không hợp lệ: $modelType");
        } $column = $this->modelColumnMap[$modelType];
        foreach ($filesData as $file) {
            $extension = pathinfo($file['original_name'], PATHINFO_EXTENSION);
            $newName = Str::uuid().'.'.$extension;
            $newPath = $modelType.'/'.$modelId.'/'.$newName; // move từ temp → chính
            Storage::disk('public')->move($file['temp_path'], $newPath);
            $row = 
            [
                'TenFile' => $file['original_name'],
                'DuongDan' => $newPath,
                'LoaiFile' => $extension,
                'KichThuoc' => $file['size'] ?? null,
                'NgayTaiLen' => now()
            ];
            $row[$column] = $modelId;
            $dataToInsert[] = $row;
        } FileDinhKem::insert($dataToInsert);
    }
}
