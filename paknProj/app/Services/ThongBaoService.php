<?php

namespace App\Services;

use App\Jobs\SendThongBaoJob;

class ThongBaoService
{
    /**
     * Create a new class instance.
     */
    public function create($data)
    {
        // push vào queue
        SendThongBaoJob::dispatch($data)->onQueue('notifications');

        return true;
    }
}
