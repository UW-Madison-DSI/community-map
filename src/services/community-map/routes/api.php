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
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\Users\InstitutionUnitController;
use App\Http\Controllers\UserAccounts\UserAccountController;
use App\Http\Controllers\UserAccounts\EmailVerificationController;
use App\Http\Controllers\UserAccounts\PasswordResetController;
use App\Http\Controllers\Utilities\ContactController;
use App\Http\Controllers\Utilities\ContactInfoController;

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

// user session routes
//
Route::post('login', [SessionController::class, 'postLogin']);
Route::post('logout', [SessionController::class, 'postLogout']);
Route::get('users/{id}/logged_in', [SessionController::class, 'isLoggedIn']);

// user routes
//
Route::post('users', [UserController::class, 'postCreate']);
Route::get('users', [UserController::class, 'getAll']);
Route::get('users/self', [UserController::class, 'getSelf']);
Route::get('users/current', [UserController::class, 'getCurrent']);
Route::get('users/{id}', [UserController::class, 'getIndex']);
Route::put('users/{id}', [UserController::class, 'updateIndex']);
Route::delete('users/{id}', [UserController::class, 'deleteIndex']);
Route::get('users/names/{username}', [UserController::class, 'getByUsername']);
Route::get('users/email/{email}', [UserController::class, 'getByEmail']);

// user profile routes
//
Route::get('users/{id}/profile/photo', [UserController::class, 'getProfilePhoto']);
Route::get('users/{id}/profile/thumb', [UserController::class, 'getProfileThumbnail']);

// user account routes
//
Route::post('users/accounts/validate', [UserAccountController::class, 'postValidate']);
Route::put('users/{id}/change-password', [UserAccountController::class, 'changePassword']);
Route::post('users/email/request-username', [UserAccountController::class, 'requestUsername']);

// password reset routes
//
Route::post('password-resets', [PasswordResetController::class, 'postCreate']);
Route::get('password-resets/{id}', [PasswordResetController::class, 'getByIndex']);
Route::put('password-resets/{id}/reset', [PasswordResetController::class, 'updateByIndex']);

// email verification routes
//
Route::post('verifications', [EmailVerificationController::class, 'postCreate']);
Route::post('verifications/resend', [EmailVerificationController::class, 'postResend']);
Route::get('verifications/{key}', [EmailVerificationController::class, 'getIndex']);
Route::put('verifications/{key}', [EmailVerificationController::class, 'updateIndex']);
Route::put('verifications/{key}/verify', [EmailVerificationController::class, 'putVerify']);
Route::delete('verifications/{key}', [EmailVerificationController::class, 'deleteIndex']);

// institution routes
//
Route::get('institution-units', [InstitutionUnitController::class, 'getAll']);
Route::get('institution-units/{id}', [InstitutionUnitController::class, 'getIndex']);
Route::get('institution-units/{id}/people', [InstitutionUnitController::class, 'getPeople']);
Route::get('institution-units/{id}/affiliations', [InstitutionUnitController::class, 'getAffiliates']);

// contact form routes
//
Route::post('contacts', [ContactController::class, 'postCreate']);

// contact info routes
//
Route::get('contact-info', [ContactInfoController::class, 'getContactInfo']);