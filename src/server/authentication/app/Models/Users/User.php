<?php
/******************************************************************************\
|                                                                              |
|                                   User.php                                   |
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
|            Copyright (C) 2016-2020, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users;

use Illuminate\Support\Facades\Session;
use App\Casts\Terms;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\Person;

class User extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'user_accounts';

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

		// personal info
		//
		'has_profile_photo',
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
		'primary_unit_affiliation',
		'non_primary_unit_affiliation_ids',
		'is_affiliate',

		// institution info
		//
		'primary_institution_id',
		'appointment_type',
		'building_number',

		// research info
		//
		'research_summary',
		'research_terms',
		'research_interests',

		// academic info
		//
		'degree_institution_name',
		'degree_year',
		'orcid_id',

		// personal info
		//
		'has_profile_photo',
		'homepage',
		'social_url',
		'github_url',

		// account info
		//
		'username',
		'email',
		'options',

		// timestamps
		//
		'created_at',
		'updated_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [

		// name info
		//
		'title',
		'first_name',
		'middle_name',
		'last_name',

		// affiliation info
		//
		'primary_unit_affiliation_id',
		'primary_unit_affiliation',
		'non_primary_unit_affiliation_ids',
		'is_affiliate',

		// institution info
		//
		'primary_institution_id',
		'appointment_type',
		'building_number',

		// research info
		//
		'research_summary',
		'research_terms',
		'research_interests',

		// academic info
		//
		'degree_institution_name',
		'degree_year',
		'orcid_id',

		// personal info
		//
		'has_profile_photo',
		'homepage',
		'social_url',
		'github_url',

		// account info
		//
		'username',
		'email',
		'options'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'id' => 'integer',
		'primary_unit_affiliation_id' => 'integer',
		'primary_institutioni_id' => 'integer',
		'is_affiliate' => 'boolean',
		'degree_year' => 'integer'
	];

	//
	// accessor methods
	//

	/**
	 * Get this user's title attribute.
	 *
	 * @return string
	 */
	public function getTitleAttribute(): ?string {
		return $this->person? $this->person->title : '';
	}

	/**
	 * Get this user's first name attribute.
	 *
	 * @return string
	 */
	public function getFirstNameAttribute(): ?string {
		return $this->person? $this->person->firstName : '';
	}

	/**
	 * Get this user's middle name attribute.
	 *
	 * @return string
	 */
	public function getMiddleNameAttribute(): ?string {
		return $this->person? $this->person->middleName : '';
	}

	/**
	 * Get this user's last name attribute.
	 *
	 * @return string
	 */
	public function getLastNameAttribute(): ?string {
		return $this->person? $this->person->lastName : '';
	}

	/**
	 * Get this user's profile photo url attribute.
	 *
	 * @return string
	 */
	public function getProfilePhotoUrlAttribute(): ?string {
		return $this->person? $this->person->profilePhotoUrl : null;
	}

	/**
	 * Get this user's profile photo attribute.
	 *
	 * @return string
	 */
	public function getHasProfilePhotoAttribute(): bool {
		return $this->person? $this->person->profilePhoto  != null : false;
	}

	/**
	 * Get this user's homepage attribute.
	 *
	 * @return string
	 */
	public function getHomepageAttribute(): ?string {
		return $this->person? $this->person->homepage : null;
	}

	/**
	 * Get this user's social url attribute.
	 *
	 * @return string
	 */
	public function getSocialUrlAttribute(): ?string {
		return $this->person? $this->person->socialUrl : null;
	}

	/**
	 * Get this user's github url attribute.
	 *
	 * @return string
	 */
	public function getGithubUrlAttribute(): ?string {
		return $this->person? $this->person->githubUrl : null;
	}

	/**
	 * Get this user's primary unit affiliation attribute.
	 *
	 * @return string
	 */
	public function getPrimaryUnitAffiliationAttribute(): ?object {
		return $this->person? $this->person->primaryUnitAffiliation : null;
	}

	/**
	 * Get this user's primary unit affiliation id attribute.
	 *
	 * @return string
	 */
	public function getPrimaryUnitAffiliationIdAttribute(): ?int {
		return $this->person? $this->person->primaryUnitAffiliationId : null;
	}

	/**
	 * Get this user's non-primary unit affiliation ids attribute.
	 *
	 * @return string
	 */
	public function getNonPrimaryUnitAffiliationIdsAttribute(): ?array {
		return $this->person? $this->person->nonPrimaryUnitAffiliationIds : [];
	}

	/**
	 * Get this user's is_affiliate attribute.
	 *
	 * @return string
	 */
	public function getIsAffiliateAttribute(): bool {
		return $this->person? $this->person->isAffiliate : false;
	}

	/**
	 * Get this user's primary institution id attribute.
	 *
	 * @return string
	 */
	public function getPrimaryInstitutionIdAttribute(): ?int {
		return $this->person? $this->person->primaryInstitutionId : null;
	}

	/**
	 * Get this user's appointment type attribute.
	 *
	 * @return string
	 */
	public function getAppointmentTypeAttribute(): ?string {
		return $this->person? $this->person->appointmentType : null;
	}

	/**
	 * Get this user's building number attribute.
	 *
	 * @return int
	 */
	public function getBuildingNumberAttribute(): ?int {
		return $this->person? $this->person->buildingNumber : null;
	}

	/**
	 * Get this user's degree institution name attribute.
	 *
	 * @return string
	 */
	public function getDegreeInstitutionNameAttribute(): ?string {
		return $this->person? $this->person->degreeInstitutionName :null;
	}

	/**
	 * Get this user's degree year attribute.
	 *
	 * @return string
	 */
	public function getDegreeYearAttribute(): ?int {
		return $this->person? $this->person->degreeYear : null;
	}

	/**
	 * Get this user's orcid id attribute.
	 *
	 * @return string
	 */
	public function getOrcidIdAttribute(): ?string {
		return $this->person? $this->person->orcidId : null;
	}

	/**
	 * Get this user's research summary attribute.
	 *
	 * @return string
	 */
	public function getResearchSummaryAttribute(): ?string {
		return $this->person? $this->person->researchSummary : null;
	}

	/**
	 * Get this user's research terms attribute.
	 *
	 * @return string
	 */
	public function getResearchTermsAttribute(): array {
		return $this->person? $this->person->researchTerms : [];
	}

	/**
	 * Get this user's research interests attribute.
	 *
	 * @return string
	 */
	public function getResearchInterestsAttribute(): array {
		return $this->person? $this->person->researchInterests : [];
	}

	/**
	 * Get this user's username attribute.
	 *
	 * @return string
	 */
	public function getUsernameAttribute(): string {
		return $this->account? $this->account->username : '';
	}

	/**
	 * Get this user's email attribute.
	 *
	 * @return string
	 */
	public function getEmailAttribute(): string {
		return $this->account? $this->account->email : '';
	}

	/**
	 * Get this user's options attribute.
	 *
	 * @return string
	 */
	public function getOptionsAttribute(): array {
		return $this->account? $this->account->options : [];
	}

	//
	// relationship methods
	//

	/**
	 * Get this users's relationship to its account.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function person() {
		return $this->hasOne('App\Models\Users\Person', 'id');
	}

	/**
	 * Get this users's relationship to its account.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function account() {
		return $this->hasOne('App\Models\UserAccounts\UserAccount', 'id');
	}

	//
	// querying methods
	//

	/**
	 * Whether or not this user is a new user.
	 *
	 * @return bool
	 */
	public function isNewUser(): bool {
		return $this->account? $this->account->penultimate_login_at == NULL : false;
	}

	/**
	 * Whether or not this user is the currently logged in user.
	 *
	 * @return bool
	 */
	public function isCurrent(): bool {
		return $this->id == Session::get('user_id');
	}

	/**
	 * Whether or not this users is an administrator.
	 *
	 * @return bool
	 */
	public function isAdmin(): bool {
		return $this->account? $this->account->isAdmin() : false;
	}

	/**
	 * Whether or not this user is a DSI affiliate.
	 *
	 * @return bool
	 */
	public function isAffiliate(): bool {
		return $this->account? $this->account->is_affiliate == true : false;
	}

	/**
	 * Whether or not this user is currently logged in.
	 *
	 * @return bool
	 */
	public function isOnline(): bool {
		return UserSession::where('user_id', '=', $this->id)->exists();
	}

	/**
	 * Whether or not this user has an account.
	 *
	 * @return bool
	 */
	public function hasAccount(): bool {
		return $this->account != null;
	}

	/**
	 * Get whether this user has an email address.
	 *
	 * @return bool
	 */
	public function hasEmail(): bool {
		return $this->account && $this->account->hasEmail();
	}

	//
	// getting methods
	//

	/**
	 * Get this users's email address.
	 *
	 * @return string
	 */
	public function getEmail(): ?string {
		return $this->account? $this->account->email : null;
	}

	/**
	 * Get this users's profile photo
	 *
	 * @return string
	 */
	public function getProfilePhoto() {
		$filename = $this->profilePhoto;
		$directory = config('filesystems.disks.local.root');
		$filepath =  $directory . '/' . $filename;

		if ($filename != null && $directory != null) {
			if (file_exists($filepath)) {
				$data = file_get_contents($filepath);
				return response($data, 200)->header('Content-Type', 'image/jpg');
			} else {
				return "File not found.";
			}
		} else {
			return "No profile photo.";
		}
	}

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

	//
	// deleting method
	//

	/**
	 * Delete this user.
	 *
	 * @return bool
	 */
	public function delete(): bool {
		$success1 = false;
		$success2 = false;

		// delete user account
		//
		if ($this->account) {
			$success1 = $this->account->delete();
		}

		// delete person
		//
		if ($this->person) {
			$success2 = $this->person->delete();
		}

		return $success1 && $success2;
	}

	/**
	 * Get the current user.
	 *
	 * @return App\Models\Users\User
	 */
	public static function current(): ?User {
		return self::find(Session::get('user_id'));
	}
}
