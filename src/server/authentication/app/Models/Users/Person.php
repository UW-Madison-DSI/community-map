<?php
/******************************************************************************\
|                                                                              |
|                                 Person.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a person.                                     |
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

use App\Casts\Terms;
use App\Models\BaseModel;
use App\Models\InstitutionUnit;

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
	protected $table = 'people';

	/**
	 * The connection associated with the model.
	 *
	 * @var string
	 */
	protected $connection = 'mysql2';

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
		'firstName',
		'middleName',
		'lastName',

		// professional info
		//
		'primaryUnitAffiliationId',
		'nonPrimaryUnitAffiliationIds',
		'primaryInstitutionId',
		'appointmentType',

		// research info
		//
		'researchSummary',
		'researchTerms',
		'researchInterests',

		// academic info
		//
		'degreeInstitutionName',
		'degreeYear',
		'orcidId',

		// personal info
		//
		'profilePhoto',
		'homepage',
		'socialUrl',
		'githubUrl'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',

		// name info
		//
		'title',
		'firstName',
		'middleName',
		'lastName',

		// professional info
		//
		'primaryUnitAffiliationId',
		'nonPrimaryUnitAffiliationIds',
		'primaryInstitutionId',
		'appointmentType',

		// research info
		//
		'researchSummary',
		'researchTerms',
		'researchInterests',

		// academic info
		//
		'degreeInstitutionName',
		'degreeYear',
		'orcidId',

		// personal info
		//
		'profilePhoto',
		'homepage',
		'socialUrl',
		'githubUrl'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'primaryUnitAffiliation',
		'nonPrimaryUnitAffiliations',
		'isProtected'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'researchTerms' => Terms::class,
		'researchInterests' => Terms::class
	];

	//
	// accessor methods
	//

	/**
	 * Get this person's primary unit affiliation attribute.
	 *
	 * @return object
	 */
	public function getPrimaryUnitAffiliationAttribute() {
		return InstitutionUnit::find($this->primaryUnitAffiliationId);
	}

	/**
	 * Get this person's non-primary unit affiliations attribute.
	 *
	 * @return object[]
	 */
	public function getNonPrimaryUnitAffiliationsAttribute(): array {
		$names = [];
		$ids = explode(', ', $this->nonPrimaryUnitAffiliationIds);
		for ($i = 0; $i < count($ids); $i++) {
			$institutionUnit = InstitutionUnit::find($ids[$i]);
			if ($institutionUnit) {
				array_push($names, $institutionUnit);
			}
		}
		return $names;
	}

	/**
	 * Get this users's full name.
	 *
	 * @return string
	 */
	public function getFullName(): string {
		$name = '';

		if ($this->firstName) {
			$name .= $this->firstName;
		}
		if ($this->middleName) {
			$name .= ' ' . $this->middleName;
		}
		if ($this->lastName) {
			$name .= ' ' . $this->lastName;
		}
		
		return ucwords($name);
	}

	/**
	 * Get this person's protected status.
	 *
	 * @return bool
	 */
	public function getIsProtectedAttribute() {
		return $this->password != null;
	}
}
