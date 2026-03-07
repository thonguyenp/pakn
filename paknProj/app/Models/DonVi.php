<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonVi extends Model
{
    protected $table = 'DonVi';
    protected $primaryKey = 'IdDonVi';
    public $timestamps = false;

    protected $fillable = [
        'TenDonVi',
        'MoTa',
        'EmailLienHe',
        'SoDienThoai',
        'TrangThai',
        'NgayTao'
    ];
}
