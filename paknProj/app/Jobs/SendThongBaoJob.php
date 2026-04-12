<?php

namespace App\Jobs;

use App\Events\ThongBaoCreated;
use App\Models\ThongBao;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendThongBaoJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $tb = ThongBao::create([
            'TieuDe' => $this->data['TieuDe'],
            'NoiDung' => $this->data['NoiDung'],
            'IdNguoiDung' => $this->data['IdNguoiDung'],
            'Loai' => $this->data['Loai'],
            'Link' => $this->data['Link'] ?? null,
            'NgayTao' => now(),
        ]);

        // broadcast realtime
        broadcast(new ThongBaoCreated($tb));
    }
}
