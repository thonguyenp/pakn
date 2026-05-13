<?php

namespace App\States\PhanAnh;
use Illuminate\Contracts\Container\Container;
class PhanAnhStateFactory
{
    protected Container $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public static function make($action): PhanAnhStateInterface
    {
        return (new self(app()))->create($action);
    }

    public function create($action): PhanAnhStateInterface
    {
        $action = (int) $action;

        return match ($action) {
            2 => $this->container->make(TiepNhanState::class),
            3 => $this->container->make(XuLyState::class),
            4 => $this->container->make(BoSungThongTinState::class),
            5 => $this->container->make(ChuyenDonViState::class),
            6 => $this->container->make(HoanThanhState::class),
            7 => $this->container->make(TuChoiState::class),
            default => throw new \Exception('Action không hợp lệ: ' . $action),
        };
    }
}