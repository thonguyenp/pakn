<?php

namespace App\States\PhanAnh;

class PhanAnhStateFactory
{
    public static function make($action): PhanAnhStateInterface
    {
        $action = (int) $action;

        return match ($action) {
            7 => new TuChoiState(),
            default => throw new \Exception('Action không hợp lệ'),
        };
    }
}