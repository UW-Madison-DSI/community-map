<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\InstitutionUnitController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('environment', function() {
	return App::environment();
});

Route::get('buildings', [BuildingController::class, 'getAll']);
Route::get('buildings/{id}', [BuildingController::class, 'getIndex']);

Route::get('departments', [DepartmentController::class, 'getAll']);
Route::get('departments/{id}', [DepartmentController::class, 'getIndex']);

Route::get('institution_units', [InstitutionUnitController::class, 'getAll']);
Route::get('institution_units/{id}', [InstitutionUnitController::class, 'getIndex']);