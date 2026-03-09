<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VaiTro extends Model
{
    protected $table = 'VaiTro';

    protected $primaryKey = 'IdVaiTro';

    public $timestamps = false;

    protected $fillable = [
        'TenVaiTro',
        'MoTa'
    ];

    public function quyens()
    {
        return $this->belongsToMany(
            Quyen::class,
            'VaiTroQuyen',
            'IdVaiTro',
            'IdQuyen'
        );
    }

    public function nguoiDungs()
    {
        return $this->belongsToMany(
            NguoiDung::class,
            'NguoiDungVaiTro',
            'IdVaiTro',
            'IdNguoiDung'
        );
    }
}