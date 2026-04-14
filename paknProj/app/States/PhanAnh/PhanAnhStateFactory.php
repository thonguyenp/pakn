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
        // Nếu bạn muốn giữ static, có thể dùng app() helper (xem cách 1b)
        // Nhưng khuyến nghị inject container
        return (new self(app()))->create($action);
    }

    public function create($action): PhanAnhStateInterface
    {
        $action = (int) $action;

        return match ($action) {
            7 => $this->container->make(TuChoiState::class),
            4 => $this->container->make(BoSungThongTinState::class),
            default => throw new \Exception('Action không hợp lệ: ' . $action),
        };
    }
}