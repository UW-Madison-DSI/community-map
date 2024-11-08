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
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Users\User;
use App\Models\UserAccounts\UserAccount;
use App\Models\UserAccounts\EmailVerification;

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

Route::get('update-user-create-dates', function() {
	echo "Updating user create dates... <br />";
	$users = User::all();
	for ($i = 0; $i < count($users); $i++) {
		$user = $users[$i];

		if ($user && !$user->created_at) {
			$emailVerification = EmailVerification::where('user_id', '=', $user->id)->first();
			if ($emailVerification && $emailVerification->verified_at) {
				$date = $emailVerification->verified_at;
				echo "Setting create date of user " . $user->getFullName() . " to " . $date . "<br />";
				$user->created_at = $date;
				$user->save();
			}
		}	
	}
	echo "done. <br />";
});

Route::get('update-user-account-create-dates', function() {
	echo "Updating user account create dates... <br />";
	$users = User::all();
	for ($i = 0; $i < count($users); $i++) {
		$user = $users[$i];
		$userAccount = UserAccount::find($user->id);

		if ($userAccount) {
			if (!$userAccount->created_at) {
				$emailVerification = EmailVerification::where('user_id', '=', $user->id)->first();
				if ($emailVerification && $emailVerification->verified_at) {
					$date = $emailVerification->verified_at;
					echo "Setting create date of user account " . $userAccount->username . " to " . $date . "<br />";
					$userAccount->created_at = $date;
					$userAccount->save();
				}
			}
		} else {
			echo "No user account for " . $user->getFullName() . ", user #" . $user->id . "<br />";
		}
	}
	echo "done. <br />";
});