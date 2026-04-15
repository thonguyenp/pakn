<?php

namespace App\Events;

use App\Models\ThongBao;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ThongBaoCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $thongBao;
    public $broadcastQueue = 'notifications';

    public function __construct(ThongBao $thongBao)
    {
        $this->thongBao = $thongBao;
    }

    public function broadcastOn()
    {
        Log::info('Broadcasting to user.'.$this->thongBao->IdNguoiDung);

        return new PrivateChannel('user.'.$this->thongBao->IdNguoiDung);
    }

    public function broadcastAs()
    {
        return 'thongbao.created';
    }
}
