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
|            Copyright (C) 2016-2020, Sharedigm, www.sharedigm.com             |
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
use App\Utilities\Filters\DateFilters;
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

		// create new user account
		//
		$userAccount = new UserAccount([
			'id' => Person::max('id') + 1,
			'username' => $request->input('username'),
			'password' => $request->input('password'),
			'enabled_flag' => 1,
			'email' => $request->input('email'),
			'email_verified_flag' => 0,
			'options' => $request->input('options'),
			'admin_flag' => 0,
		]);

		// create new person
		//
		$person = new Person([
			'id' => Person::max('id') + 1,

			// name info
			//
			'title' => $request->input('title'),
			'firstName' => $request->input('first_name'),
			'middleName' => $request->input('middle_name'),
			'lastName' => $request->input('last_name'),

			// affiliation info
			//
			'primaryUnitAffiliationId' => $request->input('primary_unit_affiliation_id'),
			'otherPrimaryUnitAffiliation' => $request->input('primary_unit_affiliation'),
			'nonPrimaryUnitAffiliationIds' => $request->input('non_primary_unit_affiliation_ids'),
			'isAffiliate' => $request->input('is_affiliate') != true,

			// institution info
			//
			'primaryInstitutionId' => $request->input('primary_institution_id'),
			'appointmentType' => $request->input('appointment_type'),
			'buildingNumber' => $request->input('building_number'),

			// research info
			//
			'researchSummary' => $request->input('research_summary'),
			'researchTerms' => explode(', ', $request->input('research_terms')),
			'researchInterests' => explode(', ', $request->input('research_interests')),

			// academic info
			//
			'degreeInstitutionName' => $request->input('degree_institution_name'),
			'degreeYear' => $request->input('degree_year'),
			'orcidId' => $request->input('orcid_id'),

			// personal info
			//
			'profilePhoto' => $request->input('profile_photo'),
			'homepage' => $request->input('homepage'),
			'socialUrl' => $request->input('social_url'),
			'githubUrl' => $request->input('github_url')
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
		$person->save();
		$userAccount->add();

		return User::find($userAccount->id);
	}

	//
	// querying methods
	//

	/**
	 * Get the current user.
	 *
	 * @param string $id - the id of the user to get
	 * @return App\Models\Users\User
	 */
	public function getCurrent() {
		
		// find user by id
		//
		$user = User::find(Session::get('user_id'));
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
		$user = User::find($id);
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
		$user = User::find($userAccount->user_id);
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
		$user = User::find($userAccount->user_id);
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
		
		// create query
		//
		$query = User::orderBy('created_at', 'DESC');

		// add filters
		//
		$query = DateFilters::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		// execute query
		//
		return $query->get();
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

		// find person by id
		//
		$person = Person::find($id);
		if (!$person) {
			return response("Person not found.", 404);
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
			'firstName' => $request->input('first_name'),
			'middleName' => $request->input('middle_name'),
			'lastName' => $request->input('last_name'),

			// affiliation info
			//
			'primaryUnitAffiliationId' => $request->input('primary_unit_affiliation_id'),
			'otherPrimaryUnitAffiliation' => $request->input('primary_unit_affiliation'),
			'nonPrimaryUnitAffiliationIds' => $request->input('non_primary_unit_affiliation_ids'),
			'isAffiliate' => $request->input('is_affiliate'),

			// institution info
			//
			'primaryInstitutionId' => $request->input('primary_institution_id'),
			'appointmentType' => $request->input('appointment_type'),
			'buildingNumber' => $request->input('building_number'),

			// research info
			//
			'researchSummary' => $request->input('research_summary'),
			'researchTerms' => $request->input('research_terms'),
			'researchInterests' => $request->input('research_interests'),

			// academic info
			//
			'degreeInstitutionName' => $request->input('degree_institution_name'),
			'degreeYear' => $request->input('degree_year'),
			'orcidId' => $request->input('orcid_id'),

			// personal info
			//
			'homepage' => $request->input('homepage'),
			'socialUrl' => $request->input('social_url'),
			'githubUrl' => $request->input('github_url')
		]);

		// change profile photo
		//
		if (isset($filename)) {
			$person->change([
				'profilePhoto' => $filename
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
