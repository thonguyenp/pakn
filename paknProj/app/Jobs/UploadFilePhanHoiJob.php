<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\File;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UploadFilePhanHoiJob implements ShouldQueue
{
use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 120;
    public $backoff = [10, 30, 60];

    protected $idPhanHoi;
    protected $filesData;   // mảng thông tin file đã lưu

    public function __construct($idPhanHoi, array $filesData)
    {
        $this->idPhanHoi = $idPhanHoi;
        $this->filesData = $filesData;
    }

    public function handle()
    {
        $dataToInsert = [];

        foreach ($this->filesData as $file) {
            $dataToInsert[] = [
                'TenFile'    => $file['TenFile'],
                'DuongDan'   => $file['DuongDan'],
                'LoaiFile'   => $file['LoaiFile'],
                'KichThuoc'  => $file['KichThuoc'],
                'NgayTaiLen' => now(),
                'IdPhanHoi'  => $this->idPhanHoi,
            ];
        }

        if (!empty($dataToInsert)) {
            \App\Models\FileDinhKem::insert($dataToInsert);
            Log::info("Đã lưu thông tin " . count($dataToInsert) . " file cho PhanHoi ID: " . $this->idPhanHoi);
        }
    }

    public function failed(\Throwable $exception)
    {
        Log::error("SaveFilePhanHoiJob thất bại cho IdPhanHoi: " . $this->idPhanHoi, [
            'error' => $exception->getMessage()
        ]);
    }
}
