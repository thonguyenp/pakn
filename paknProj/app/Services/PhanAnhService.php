<?php

namespace App\Services;

use App\States\PhanAnh\PhanAnhStateFactory;

class PhanAnhService
{
    public function __construct(
        protected PhanAnhStateFactory $stateFactory
    ) {}

    public function handleAction($maTheoDoi, $data, $files)
    {
        $state = $this->stateFactory->create($data['action']);   // dùng create() thay vì make()

        return $state->handle($maTheoDoi, $data, $files);
    }
}
