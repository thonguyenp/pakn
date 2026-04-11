<?php

namespace App\Services;

use App\States\PhanAnh\PhanAnhStateFactory;

class PhanAnhService
{
    public function handleAction($maTheoDoi, $data, $files)
    {
        $state = PhanAnhStateFactory::make($data['action']);

        return $state->handle($maTheoDoi, $data, $files);
    }
}
