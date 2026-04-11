<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PhanAnhCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $maTheoDoi;

    public function __construct($maTheoDoi)
    {
        $this->maTheoDoi = $maTheoDoi;
        $this->onConnection('redis');     // Ép dùng redis
        $this->onQueue('emails');         // Ép vào queue 'emails'
        $this->afterCommit();             // Đảm bảo sau transaction
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Mã theo dõi phản ánh')
            ->line('Bạn đã gửi phản ánh thành công.')
            ->line('Mã theo dõi của bạn là:')
            ->line($this->maTheoDoi)
            ->line('Vui lòng lưu lại để tra cứu.')
            ->line('Cảm ơn bạn!');
    }
}