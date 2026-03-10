<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quyen extends Model
{
    protected $table = 'Quyen';

    protected $primaryKey = 'IdQuyen';

    public $timestamps = false;

    protected $fillable = [
        'TenQuyen',
        'MoTa'
    ];
    
    public function nguoiDungs()
    {
        return $this->belongsToMany(
            NguoiDung::class,
            'NguoiDungQuyen',
            'IdQuyen',
            'IdNguoiDung'
        )->withPivot('TrangThai','NgayGanQuyen');
    }
}