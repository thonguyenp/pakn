<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MucDoKhanCap extends Model
{
    protected $table = 'mucdokhancap';

    protected $primaryKey = 'IdMucDoKhanCap';

    public $timestamps = false;

    protected $fillable = [
        'TenMucDo',
        'SoGioXuLyMacDinh'
    ];

    protected $casts = [
        'SoGioXuLyMacDinh' => 'integer',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function thoiHanXuLyLinhVucs()
    {
        return $this->hasMany(ThoiHanXuLyLinhVuc::class, 'IdMucDoKhanCap');
    }
}