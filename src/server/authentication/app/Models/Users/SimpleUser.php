<?php
/******************************************************************************\
|                                                                              |
|                                SimpleUser.php                                |
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
use App\Models\TimeStamps\TimeStamped;

class SimpleUser extends TimeStamped
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
		'first_name',
		'middle_name',
		'last_name',
		'country'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'first_name',
		'middle_name',
		'last_name',
		'country',

		// account info
		//
		'username',
		'email',
		'receive_newsletter',
		'receive_updates',

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
		'username',
		'email',
		'receive_newsletter',
		'receive_updates'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'receive_newsletter' => 'boolean',
		'receive_updates' => 'boolean'
	];

	//
	// accessor methods
	//

	/**
	 * Get this user's username attribute.
	 *
	 * @return string
	 */
	public function getUsernameAttribute(): ?string {
		return $this->account? $this->account->username : '';
	}

	/**
	 * Get this user's email attribute.
	 *
	 * @return string
	 */
	public function getEmailAttribute(): ?string {
		return $this->account? $this->account->email : '';
	}

	//
	// relationship methods
	//

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
	 * Whether or not this user is currently logged in.
	 *
	 * @return bool
	 */
	public function isOnline(): bool {
		return UserSession::where('user_id', '=', $this->id)->exists();
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

		// delete user account
		//
		$this->account->delete();
		
		// delete the user
		//
		return parent::delete();
	}

	//
	// static methods
	//

	/**
	 * Find a user by id (or 'current')
	 *
	 * @return App\Models\Users\User
	 */
	public static function find($id): ?User {

		// get current user
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// get user
		//
		return self::where('id', '=', $id)->first();
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
