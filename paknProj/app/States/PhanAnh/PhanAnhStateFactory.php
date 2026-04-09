<?php

namespace App\States\PhanAnh;

class PhanAnhStateFactory
{
    public static function make($action): PhanAnhStateInterface
    {
        $action = (int) $action;

        return match ($action) {
            7 => new TuChoiState(),
            4 => new BoSungThongTinState(),
            default => throw new \Exception('Action không hợp lệ'),
        };
    }
}