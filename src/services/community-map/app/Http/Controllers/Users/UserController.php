<?php
/******************************************************************************\
|                                                                              |
|                              UserController.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' authentication information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Image;
use App\Models\Users\User;
use App\Models\Users\Person;
use App\Models\UserAccounts\UserAccount;
use App\Models\UserAccounts\PasswordReset;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;
use App\Utilities\Filters\NameFilter;
use App\Utilities\Filters\InstitutionUnitFilter;
use App\Utilities\Filters\TopicFilter;
use App\Utilities\Filters\TermFilter;
use App\Utilities\Filters\CommunityFilter;
use App\Utilities\Filters\LimitFilter;

class UserController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\User
	 */
	public function postCreate(Request $request) {

		// parse params
		//
		$username = $request->input('username');
		$password = $request->input('password');
		$email = $request->input('email');
		$options = $request->input('options');

		// check params
		//
		if (!$username) {
			return response('No username provided.', 400);
		}

		// create new user account
		//
		$userAccount = new UserAccount([
			'id' => User::max('id') + 1,
			'username' => $username,
			'password' => $password,
			'enabled_flag' => 1,
			'email' => $email,
			'email_verified_flag' => 0,
			'options' => $options,
			'admin_flag' => 0,
		]);

		// create new person
		//
		$user = new User([
			'id' => User::max('id') + 1,

			// name info
			//
			'title' => $request->input('title'),
			'first_name' => $request->input('first_name'),
			'middle_name' => $request->input('middle_name'),
			'last_name' => $request->input('last_name'),

			// institution info
			//
			'appointment_yype' => $request->input('appointment_type'),
			'building_number' => $request->input('building_number'),

			// affiliation info
			//
			'primary_unit_affiliation_id' => $request->input('primary_unit_affiliation_id'),
			'other_primary_unit_affiliation' => $request->input('primary_unit_affiliation'),
			'non_primary_unitAffiliationIds' => $request->input('non_primary_unit_affiliation_ids'),
			'is_affiliate' => $request->input('is_affiliate') == true,
			'communities' => $request->input('communities'),

			// academic info
			//
			'degree_institution' => $request->input('degree_institution'),
			'degree_year' => $request->input('degree_year'),
			'orcid_id' => $request->input('orcid_id'),

			// research info
			//
			'research_summary' => $request->input('research_summary'),
			'research_terms' => $request->input('research_terms'),
			'research_interests' => $request->input('research_interests'),

			// personal info
			//
			'profile_photo' => $request->input('profile_photo'),
			'homepage' => $request->input('homepage'),
			'social_url' => $request->input('social_url'),
			'github_url' => $request->input('github_url')
		]);

		// check if user account is valid (if username
		// and email address are not already taken).
		//
		$errors = [];
		if (!$userAccount->isTaken($errors)) {
			return response(json_encode($errors), 409);
		}

		// add new user
		//
		$user->save();
		$userAccount->add();

		return User::find($userAccount->id);
	}

	//
	// getting methods
	//

	/**
	 * Get the current user.
	 *
	 * @param string $id - the id of the user to get
	 * @return App\Models\Users\User
	 */
	public function getSelf() {

		// find user by session
		//
		$user = User::find(Session::get('user_id'));

		// check for user
		//
		if (!$user) {
			return response('No session.', 200);
		}

		return $user;
	}

	/**
	 * Get the current user.
	 *
	 * @param string $id - the id of the user to get
	 * @return App\Models\Users\User
	 */
	public function getCurrent() {

		// find current user
		//
		if (config('app.sso_username') && $_SERVER[config('app.sso_username')]) {

			// find user by Shibboleth id
			//
			$username = $_SERVER[config('app.sso_username')];		
			$userAccount = $username? UserAccount::where('username', '=', $username)->first() : null;
			$user = $userAccount? User::find($userAccount->id) : null;	

			// update user's email using SSO information
			//
			if ($userAccount && !$userAccount->email) {
				$userAccount->email = $_SERVER[config('app.sso_email')];
				$userAccount->save();
			}
		} else {

			// find user by session
			//
			$user = User::find(Session::get('user_id'));
		}

		// check for user
		//
		if (!$user) {
			return response('No session.', 200);
		}

		return $user;
	}

	/**
	 * Get a user.
	 *
	 * @param string $id - the id of the user to get
	 * @return App\Models\Users\User
	 */
	public function getIndex(string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}
		
		// find user by id
		//
		$user = Person::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get a user by username.
	 *
	 * @param string $username - the username of the user to get
	 * @return App\Models\Users\User
	 */
	public function getByUsername(string $username) {

		// get user's account
		//
		$userAccount = UserAccount::byUsername($username)->first();
		if (!$userAccount) {
			return response("Could not find a user account associated with the username: " . $username, 404);
		}

		// find user by id
		//
		$user = Person::find($userAccount->user_id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get a user by email address.
	 *
	 * @param string $email - the email of the user to get
	 * @return App\Models\Users\User
	 */
	public function getByEmail(string $email) {

		// get user's account
		//
		$userAccount = UserAccount::byEmail($email)->first();
		if (!$userAccount) {
			return response("Could not find a user account associated with the email address: " . $email, 404);
		}

		// find user by id
		//
		$user = Person::find($userAccount->user_id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get all users.
	 *
	 * @return App\Models\Users\User[]
	 */
	public function getAll(Request $request) {
		$currentUser = User::current();
		$isAdmin = $currentUser && $currentUser->isAdmin();

		// create query
		//
		if ($isAdmin) {
			$query = User::orderBy('last_name', 'DESC');
		} else {
			$query = Person::orderBy('last_name', 'DESC');
		}

		// add filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = InstitutionUnitFilter::applyTo($request, $query);
		$query = TopicFilter::applyTo($request, $query);
		$query = TermFilter::applyTo($request, $query);
		$query = CommunityFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		// execute query
		//
		return $query->get()->filter(function($item) {
			return !$item->isAdmin();
		});
	}

	//
	// profile photo getting methods
	//

	/**
	 * Get a user's profile photo.
	 *
	 * @param string $id - the id of the user to get the profile photo of
	 * @return Image
	 */
	public function getProfilePhoto(string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		// get photo data
		//
		$photo = $user->getProfilePhoto();

		// add response headers
		//
		return response($photo, 200)->header('Content-Type', 'image/jpg');
	}

	/**
	 * Get a user's profile photo thumbnail.
	 *
	 * @param string $id - the id of the user to get the thumbnail photo of
	 * @return Image
	 */
	public function getProfileThumbnail(string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		// get thumbnail data
		//
		$thumb = $user->getProfileThumbnail($error);

		// add response headers
		//
		if ($thumb) {
			return response($thumb, 200)->header('Content-Type', 'image/jpg');
		} else {
			return $error;
		}
	}

	//
	// updating methods
	//

	/**
	 * Update a user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// find user account by id
		//
		$userAccount = UserAccount::find($id);
		if (!$userAccount) {
			return response("User account not found.", 404);
		}

		// find user by id
		//
		$person = User::find($id);
		if (!$person) {
			return response("User not found.", 404);
		}

		// update user account
		//
		$userAccount->change([
			'username' => $request->input('username'),
			'email' => $request->input('email'),
			'options' => $request->input('options')
		]);

		// save profile photo
		//
		if ($request->has('profile_photo') && $request->get('profile_photo') != '') {
			$data = $request->input('profile_photo');
			$name = $request->input('profile_photo_name');
			$extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));

			// remove encoding header
			//
			$data = str_replace('data:image/jpeg;base64,', '', $data);
			$data = str_replace('data:image/png;base64,', '', $data);
			$data = str_replace('data:image/gif;base64,', '', $data);

			// decode from base64
			//
			$data = base64_decode($data);

			// save image data
			//
			$directory = config('filesystems.disks.local.root');
			$filename = 'profile' . $id . '.' . $extension;
			$filepath = $directory . '/' . $filename;
			file_put_contents($filepath, $data);

			// create thumbnail image
			//
			$image = \Image::make($data);

			// resize to fit
			//
			$image->fit(config('app.thumb_size'))->orientate();

			// save thumbnail image
			//
			$thumbname = 'thumb' . $id . '.' . $extension;
			$thumbpath = $directory . '/' . $thumbname;
			$quality = 60;
			$image->save($thumbpath, $quality);
		}

		// update person
		//
		$person->change([

			// name info
			//
			'title' => $request->input('title'),
			'first_name' => $request->input('first_name'),
			'middle_name' => $request->input('middle_name'),
			'last_name' => $request->input('last_name'),

			// institution info
			//
			'appointment_type' => $request->input('appointment_type'),
			'building_number' => $request->input('building_number'),

			// affiliation info
			//
			'primary_unit_affiliation_id' => $request->input('primary_unit_affiliation_id'),
			'other_primary_unit_affiliation' => $request->input('primary_unit_affiliation'),
			'non_primary_unit_affiliation_ids' => $request->input('non_primary_unit_affiliation_ids'),
			'is_affiliate' => $request->input('is_affiliate'),
			'communities' => $request->input('communities'),

			// academic info
			//
			'degree_institution' => $request->input('degree_institution'),
			'degree_year' => $request->input('degree_year'),
			'orcid_id' => $request->input('orcid_id'),

			// research info
			//
			'research_summary' => $request->input('research_summary'),
			'research_terms' => $request->input('research_terms'),
			'research_interests' => $request->input('research_interests'),

			// personal info
			//
			'homepage' => $request->input('homepage'),
			'social_url' => $request->input('social_url'),
			'github_url' => $request->input('github_url')
		]);

		// change profile photo
		//
		if (isset($filename)) {
			$person->change([
				'profile_photo' => $filename
			]);
		}
	
		// find user by id
		//
		$user = User::find($id);
		return $user;
	}

	/**
	 * Update all users.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\User[]
	 */
	public function updateAll(Request $request) {

		// check to make sure that current user is an admin
		//
		$currentUser = User::current();
		$isAdmin = $currentUser && $currentUser->isAdmin();
		if ($isAdmin) {
			return;
		}

		// get params
		//
		$input = $request->all();

		// update all users
		//
		$collection = collect();
		for ($i = 0; $i < sizeOf($input); $i++) {
			UsersController::updateIndex($item[$i]['id']);	
		}

		return $collection;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user.
	 *
	 * @param string $id - the id of the user to delete
	 * @return App\Models\Users\User
	 */
	public function deleteIndex(string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		// delete user from database and file system
		//
		$user->delete();

		// destroy session cookies
		//
		Session::flush();

		return $user;
	}
}