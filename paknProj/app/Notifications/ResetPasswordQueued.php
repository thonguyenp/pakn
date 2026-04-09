<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Log;

class ResetPasswordQueued extends ResetPasswordNotification implements ShouldQueue
{
    use Queueable;

    /**
     * Constructor - Không cần onConnection/onQueue/afterCommit ở đây
     * Vì chúng ta sẽ cấu hình ở sendPasswordResetNotification
     */
    public function __construct($token)
    {
        parent::__construct($token);   // Quan trọng: gọi parent để set token
        $this->onQueue('emails');      // Ép queue 'emails'
    }

    public function toMail($notifiable)
    {
        // Tạo URL reset (mặc định của Laravel)
        $url = $this->resetUrl($notifiable);

        // === TÙY CHỈNH SAU NÀY CHO REACT ===
        // $frontendUrl = "http://localhost:3000/reset-password?token={$this->token}&email=" . urlencode($notifiable->Email);
        // $url = $frontendUrl;

        Log::info("[ResetPasswordQueued] Dispatching reset email to: {$notifiable->Email} | Token: {$this->token}");

        return (new MailMessage)
            ->subject('Đặt lại mật khẩu - Hệ thống Phản ánh Kiến nghị Trường Đại học')
            ->greeting('Xin chào ' . $notifiable->HoTen . ',')
            ->line('Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.')
            ->line('Vui lòng nhấn vào nút bên dưới để tiến hành đặt mật khẩu mới.')
            ->action('Đặt lại mật khẩu', $url)
            ->line('Link này sẽ hết hạn sau 60 phút.')
            ->line('Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.');
    }

    /**
     * Xử lý khi job bị fail (rất hữu ích khi debug)
     */
    public function failed(\Throwable $exception)
    {
        Log::error('ResetPasswordQueued job FAILED', [
            'email'   => $this->notifiable?->Email ?? 'unknown',
            'token'   => $this->token ?? 'unknown',
            'error'   => $exception->getMessage(),
            'trace'   => $exception->getTraceAsString(),
        ]);
    }
}