<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SmtpSetting extends Model
{
    use HasFactory;

    protected $table = 'smtp_settings'; // nên đặt tên table rõ ràng

    protected $fillable = [
        'host',
        'port',
        'username',
        'password',
        'encryption',      // 'tls', 'ssl', null
        'from_email',
        'from_name',
    ];

    // Nên encrypt password (tốt cho bảo mật)
    protected $casts = [
        'port' => 'integer',
    ];

    // Helper method (sẽ dùng sau)
    public function getDecryptedPasswordAttribute()
    {
        return $this->password; // nếu bạn dùng Laravel Encryption sau này thì decrypt ở đây
    }
}