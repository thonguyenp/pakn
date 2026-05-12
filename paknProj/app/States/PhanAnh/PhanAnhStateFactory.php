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
            7 => $this->container->make(TuChoiState::class),
            4 => $this->container->make(BoSungThongTinState::class),
            2 => $this->container->make(TiepNhanState::class),
            default => throw new \Exception('Action không hợp lệ: ' . $action),
        };
    }
}