<?php

namespace App\Services;

use App\States\PhanAnh\PhanAnhStateFactory;

class PhanAnhService
{
    // private function validateTransition($current, $next)
    // {
    //     $allowed = [
    //         1 => [2, 7], // chờ duyệt -> tiếp nhận / từ chối
    //         2 => [3, 5, 7],
    //         3 => [6, 4],
    //         4 => [3],
    //         5 => [3],
    //     ];

    //     if (! in_array($next, $allowed[$current] ?? [])) {
    //         throw new \Exception('Không thể chuyển trạng thái này');
    //     }
    // }

    public function handleAction($maTheoDoi, $data, $files)
    {
        
        $state = PhanAnhStateFactory::make($data['action']);

        return $state->handle($maTheoDoi, $data, $files);
    }
}
