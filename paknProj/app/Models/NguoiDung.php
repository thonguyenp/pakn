<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;

class NguoiDung extends Model implements JWTSubject, AuthenticatableContract
{
    use Authenticatable;

    protected $table = 'NguoiDung';
    protected $primaryKey = 'IdNguoiDung';
    public $timestamps = false;

    protected $fillable = [
        'HoTen', 'Email', 'SoDienThoai', 'MatKhau', 'MaSo', 'TrangThai', 'NgayTao', 'IdDonVi'
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
}