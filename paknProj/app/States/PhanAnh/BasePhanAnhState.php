<?php

namespace App\States\PhanAnh;

abstract class BasePhanAnhState implements PhanAnhStateInterface
{
    protected function allowedTransitions($current)
    {
        return [
            1 => [2, 7],
            2 => [3, 5, 7],
            3 => [6, 4],
            4 => [3],
            5 => [3],
        ][$current] ?? [];
    }
}
