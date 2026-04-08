<?php

namespace App\States\PhanAnh;

interface PhanAnhStateInterface
{
    public function handle($maTheoDoi, $data, $files);
}