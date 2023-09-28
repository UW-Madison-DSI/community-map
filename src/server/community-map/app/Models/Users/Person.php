<?php
/******************************************************************************\
|                                                                              |
|                                  Person.php                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user.                                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

namespace App\Models\Users;

use Illuminate\Support\Facades\Session;
use App\Casts\Terms;
use App\Models\BaseModel;

class Person extends BaseModel
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	/**
	 * Indicates if the IDs are auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;

	/**
	 * The "type" of the primary key ID.
	 *
	 * @var string
	 */
	protected $keyType = 'string';
	
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'id',

		// name info
		//
		'title',
		'first_name',
		'middle_name',
		'last_name',

		// institution info
		//
		'appointment_type',
		'building_number',

		// affiliation info
		//
		'primary_unit_affiliation_id',
		'other_primary_unit_affiliation',
		'non_primary_unit_affiliation_ids',
		'is_affiliate',
		'communities',

		// academic info
		//
		'degree_institution',
		'degree_year',
		'orcid_id',

		// research info
		//
		'research_terms',
		'research_summary',
		'research_interests',
		'research_tools',

		// personal info
		//
		'profile_photo',
		'homepage',
		'social_url',
		'github_url'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',

		// personal info
		//
		'title',
		'first_name',
		'middle_name',
		'last_name',

		// affiliation info
		//
		'primary_unit_affiliation_id',
		'non_primary_unit_affiliation_ids',
		'is_affiliate',
		'communities',

		// institution info
		//
		'appointment_type',
		'building_number',

		// research info
		//
		'research_summary',
		'research_terms',
		'research_interests',

		// academic info
		//
		'degree_institution',
		'degree_year',
		'orcid_id',

		// personal info
		//
		'has_profile_photo',
		'homepage',
		'social_url',
		'github_url'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [

		// account info
		//
		'has_profile_photo'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'id' => 'integer',
		'primary_unit_affiliation_id' => 'integer',
		'is_affiliate' => 'boolean',
		'degree_year' => 'integer',
		'research_terms' => Terms::class,
		'research_interests' => Terms::class,
		'communities' => Terms::class
	];

	//
	// accessor methods
	//

	/**
	 * Get this user's profile photo attribute.
	 *
	 * @return string
	 */
	public function getHasProfilePhotoAttribute(): bool {
		return $this->profile_photo != null;
	}

	//
	// querying methods
	//

	/**
	 * Whether or not this user is the currently logged in user.
	 *
	 * @return bool
	 */
	public function isCurrent(): bool {
		return $this->id == Session::get('user_id');
	}

	/**
	 * Whether or not this user is currently logged in.
	 *
	 * @return bool
	 */
	public function isOnline(): bool {
		return UserSession::where('user_id', '=', $this->id)->exists();
	}

	//
	// getting methods
	//

	/**
	 * Get this users's short name.
	 *
	 * @return string
	 */
	public function getShortName(): string {
		$name = '';

		if ($this->first_name) {
			$name .= $this->preferred_name;
		}
		if ($this->last_name) {
			$name .= ' ' . $this->last_name;
		}

		return ucwords($name);
	}

	/**
	 * Get this users's full name.
	 *
	 * @return string
	 */
	public function getFullName(): string {
		$name = '';

		if ($this->first_name) {
			$name .= $this->first_name;
		}
		if ($this->middle_name) {
			$name .= ' ' . $this->middle_name;
		}
		if ($this->last_name) {
			$name .= ' ' . $this->last_name;
		}
		
		return ucwords($name);
	}

	/**
	 * Get this users's profile photo
	 *
	 * @return string
	 */
	public function getProfilePhoto() {
		$filename = $this->profile_photo;
		$directory = config('filesystems.disks.local.root');
		$filepath =  $directory . '/' . $filename;

		// return "filepath = " . $filepath;

		// check if a photo has been specified
		//
		if (!$filename || !$directory) {
			return "No profile photo.";
		}

		// check if photo exists
		//
		if (!file_exists($filepath)) {
			return "File not found.";
		}

		// return file info
		//
		$data = file_get_contents($filepath);
		return $data;
	}

	//
	// profie photo getting methods
	//

	/**
	 * Get this users's profile photo
	 *
	 * @return string
	 */
	public function getProfileThumbnail(&$error) {
		$filename = $this->profile_photo;
		$thumbname = str_replace('profile', 'thumb', $filename);
		$directory = config('filesystems.disks.local.root');
		$filepath =  $directory . '/' . $filename;
		$thumbpath =  $directory . '/' . $thumbname;

		// check if a profile photo has been specified
		//
		if (!$filename || !$directory) {
			$error = "No profile photo.";
			return;
		}

		// check if pre-filtered thumbnail exists
		//
		if (file_exists($thumbpath)) {

			// return file info
			//
			$data = file_get_contents($thumbpath);
			return $data;
		}

		// check if file exists
		//
		if (!file_exists($filepath)) {
			$error = "File $filepath not found.";
			return;
		}

		// downsample profile image
		//
		$data = file_get_contents($filepath);

		// resize to fit
		//
		$image->fit(config('app.thumb_size'));

		return $image->orientate();
	}
}