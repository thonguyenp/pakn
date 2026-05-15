<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class VerifyEmailQueued extends Notification implements ShouldQueue
{
    use Queueable;

    protected $token;
    protected $userId;

    public function __construct($token, $userId)
    {
        $this->token = $token;
        $this->userId = $userId;

        $this->onConnection('redis');
        $this->onQueue('emails');
        $this->afterCommit();
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = env('FRONTEND_URL').'/verify-email?token='.$this->token;

        Log::info("[VerifyEmailQueued] Dispatching email to: {$notifiable->Email} | Token: {$this->token}");

        return (new MailMessage)
            ->subject('Xác thực tài khoản - Hệ thống Phản ánh Kiến nghị')
            ->greeting('Xin chào '.$notifiable->HoTen.',')
            ->line('Cảm ơn bạn đã đăng ký.')
            ->action('Xác thực tài khoản', $url)
            ->line('Link này có hiệu lực trong 60 phút.');
    }

    public function failed(\Throwable $exception)
    {
        Log::error('VerifyEmailQueued failed: '.$exception->getMessage(), [
            'email' => $this->notifiable?->Email ?? 'N/A',
            'token' => $this->token,
        ]);
    }
}
