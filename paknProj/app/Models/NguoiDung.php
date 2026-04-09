<?php

namespace App\Models;

use App\Notifications\ResetPasswordQueued;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class NguoiDung extends Model implements AuthenticatableContract, CanResetPasswordContract, JWTSubject, MustVerifyEmail
{
    use Authenticatable, CanResetPassword, MustVerifyEmailTrait, Notifiable;

    protected $table = 'NguoiDung';

    protected $primaryKey = 'IdNguoiDung';

    public $timestamps = false;

    protected $fillable = [
        'HoTen', 'Email', 'SoDienThoai', 'MatKhau', 'MaSo', 'TrangThai', 'NgayTao', 'IdDonVi',
    ];

    protected $hidden = ['MatKhau'];

    public function getAuthPassword()
    {
        return $this->MatKhau;
    }

    public function getEmailForVerification()
    {
        return $this->Email;
    }

    public function getEmailForPasswordReset()
    {
        return $this->Email;
    }

    public function sendPasswordResetNotification($token): void
    {
        // Cách sạch và ổn định nhất cho queue + Redis
        $this->notify((new ResetPasswordQueued($token))
            ->onQueue('emails')
            ->afterCommit()           // Đảm bảo sau transaction (nếu có)
        );
    }

    public function routeNotificationForMail($notification)
    {
        return $this->Email;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function quyens()
    {
        return $this->belongsToMany(
            Quyen::class,
            'NguoiDungQuyen',
            'IdNguoiDung',
            'IdQuyen'
        )->withPivot('TrangThai', 'NgayGanQuyen');
    }
}
