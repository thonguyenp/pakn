<?php

namespace App\Jobs;

use App\Services\FileUploadService as ServicesFileUploadService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UploadFilePhanAnhJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $timeout = 120;

    public $backoff = [10, 30, 60];

    protected $idPhanAnh;

    protected $filesData;   // mảng thông tin file đã lưu

    public function __construct($idPhanAnh, array $filesData)
    {
        $this->idPhanAnh = $idPhanAnh;
        $this->filesData = $filesData;
    }

    public function handle(ServicesFileUploadService $service)
    {
        $service->handle('PhanAnh', $this->idPhanAnh, $this->filesData);
    }

    public function failed(\Throwable $exception)
    {
        Log::error('SaveFilePhanAnhJob thất bại cho IdPhanAnh: '.$this->idPhanAnh, [
            'error' => $exception->getMessage(),
        ]);
    }
}
