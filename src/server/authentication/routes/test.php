<?php
/******************************************************************************\
|                                                                              |
|                                   test.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the REST API routes used by the application.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2020, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\UserAccounts\UserAccountController;
use App\Http\Controllers\UserAccounts\EmailVerificationController;
use App\Http\Controllers\UserAccounts\PasswordResetController;
use App\Http\Controllers\Utilities\CountryController;

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

/*
Route::get('sessions', [SessionController::class, 'getAll']);
Route::get('users', [UserController::class, 'getAll']);
Route::get('user_accounts', [UserAccountController::class, 'getAll']);
Route::get('email_verifications', [EmailVerificationController::class, 'getAll']);
Route::get('password_resets', [PasswordResetController::class, 'getAll']);
Route::get('countries', [CountryController::class, 'getAll']);
*/