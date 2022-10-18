<?php
/******************************************************************************\
|                                                                              |
|                                    api.php                                   |
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
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\UserAccounts\UserAccountController;
use App\Http\Controllers\Users\UserInvitationController;
use App\Http\Controllers\UserAccounts\EmailVerificationController;
use App\Http\Controllers\UserAccounts\PasswordResetController;
use App\Http\Controllers\Utilities\ContactController;

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

//
// public routes
//

// login routes
//
Route::post('login', [SessionController::class, 'postLogin']);
Route::post('logout', [SessionController::class, 'postLogout']);

// validation / verification routes
//
Route::post('users/accounts/validate', [UserAccountController::class, 'postValidate']);

// password reset routes
//
Route::post('password-resets', [PasswordResetController::class, 'postCreate']);
Route::get('password-resets/{id}', [PasswordResetController::class, 'getByIndex']);
Route::put('password-resets/{id}/reset', [PasswordResetController::class, 'updateByIndex']);

// public user routes
//
Route::get('users/{id}', [UserController::class, 'getIndex']);
Route::post('users', [UserController::class, 'postCreate']);
Route::post('users/email/request-username', [UserAccountController::class, 'requestUsername']);
Route::get('users/invitations/{id}', [UserInvitationController::class, 'getIndex']);
Route::get('users/names/{username}', [UserController::class, 'getByUsername']);
Route::get('users/email/{email}', [UserController::class, 'getByEmail']);

// email verification routes
//
// Route::group(['middleware' => 'verify.email_verification'], function() {
	Route::post('verifications', [EmailVerificationController::class, 'postCreate']);
	Route::post('verifications/resend', [EmailVerificationController::class, 'postResend']);
	Route::get('verifications/{key}', [EmailVerificationController::class, 'getIndex']);
	Route::put('verifications/{key}', [EmailVerificationController::class, 'updateIndex']);
	Route::put('verifications/{key}/verify', [EmailVerificationController::class, 'putVerify']);
	Route::delete('verifications/{key}', [EmailVerificationController::class, 'deleteIndex']);
// });

//
// protected routes
//

// Route::group(['middleware' => 'verify.auth'], function() {

	// admin routes
	//
	/*
	// Route::group(['middleware' => 'verify.admin'], function() {
		Route::get('users/all', [UserController::class, 'getAll']);
	// });
	*/

	// user routes
	//
	// Route::group(['middleware' => 'verify.user'], function() {
		Route::get('users/{id}/logged_in', [SessionController::class, 'isLoggedIn']);
		Route::put('users/{id}/change-password', [UserAccountController::class, 'changePassword']);
		Route::put('users/{id}', [UserController::class, 'updateIndex']);
		Route::delete('users/{id}', [UserController::class, 'deleteIndex']);
	// });

	// user invitations route
	//
	Route::post('users/invitations', [UserInvitationController::class, 'postCreate']);

	// contact form routes
	//
	Route::post('contacts', [ContactController::class, 'postCreate']);
// });