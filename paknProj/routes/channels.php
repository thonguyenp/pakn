<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:api']]);

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->IdNguoiDung === (int) $id;
});