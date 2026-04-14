<?php

namespace App\Events;

use App\Models\ThongBao;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ThongBaoCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $thongBao;

    public function __construct(ThongBao $thongBao)
    {
        $this->thongBao = $thongBao;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->thongBao->IdNguoiDung);
    }

    public function broadcastAs()
    {
        return 'thongbao.created';
    }
}
