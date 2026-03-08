<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class NguoiDung extends Model implements AuthenticatableContract, JWTSubject, MustVerifyEmail
{
    use Authenticatable;
    use MustVerifyEmailTrait;
    use Notifiable;

    protected $table = 'NguoiDung';

    protected $primaryKey = 'IdNguoiDung';

    public $timestamps = false;

    protected $fillable = [
        'HoTen', 'Email', 'SoDienThoai', 'MatKhau', 'MaSo', 'TrangThai', 'NgayTao', 'IdDonVi',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $hidden = ['MatKhau'];

    public function getAuthPassword()
    {
        return $this->MatKhau;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function getEmailForVerification()
    {
        return $this->Email;
    }

    public function routeNotificationForMail($notification)
    {
        return $this->Email;
    }
}
