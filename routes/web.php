<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\BoothController;
use App\Http\Controllers\MonitorController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TotemController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\ForwardController;
use App\Http\Controllers\ScreenController;
use App\Http\Middleware\ValidateManagerAccess;

Route::get('/', function () {
    return Route::has('login')
        ? redirect()->route('login')
        : Inertia::render('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('/services', ServiceController::class)->except(['show']);
    Route::resource('/booths', BoothController::class)->except(['show']);
    Route::resource('/monitors', MonitorController::class);
    Route::resource('/attendances', AttendanceController::class);
    Route::resource('/tickets', TicketController::class)->except(['show']);
    Route::resource('/totems', TotemController::class);
    Route::resource('/users', UserController::class)->except(['show']);

    Route::resource('/manager', ManagerController::class)->except(['show'])->middleware(ValidateManagerAccess::class);

    Route::post('/forward', ForwardController::class)->name('forward');
});

Route::get('/ticket/{uuid}', ScreenController::class)->name('screen');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
