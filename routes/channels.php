<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('Booth.{id}', function () {
    return true;
});

Broadcast::channel('Monitor.{id}', function () {
    return true;
});

Broadcast::channel('Ticket.{uuid}', function () {
    return true;
});
