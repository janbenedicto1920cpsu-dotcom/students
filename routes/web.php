<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EquipmentIssueController;
use App\Http\Controllers\StudentProfileController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $issues = \App\Models\EquipmentIssue::latest()->get();

    return Inertia::render('Dashboard', [
        'issues' => $issues,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/student-profile', [StudentProfileController::class, 'show'])->name('student-profile.show');
    Route::put('/student-profile', [StudentProfileController::class, 'update'])->name('student-profile.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::resource('equipment-issues', EquipmentIssueController::class)
        ->only(['index', 'create', 'store']);
    Route::patch('/equipment-issues/{equipmentIssue}/resolve', [EquipmentIssueController::class, 'resolve'])
        ->name('equipment-issue.resolve');
});

require __DIR__.'/auth.php';
