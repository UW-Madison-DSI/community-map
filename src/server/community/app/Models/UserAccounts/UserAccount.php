<?php
/******************************************************************************\
|                                                                              |
|                               UserAccount.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's account information. This            |
|        model is used in conjunction with the User model, which               |
|        stores a user's personal information.                                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

namespace App\Models\UserAccounts;

use Illuminate\Support\Facades\Session;
use App\Casts\Terms;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Users\UserOwned;
use App\Utilities\Security\Password;

class UserAccount extends TimeStamped
{
	use UserOwned;

	const INVALID_USERNAMES = [
		'admin',
		'temp',
		'anonymous'
	];

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
	 * The connection associated with the model.
	 *
	 * @var string
	 */
	protected $connection = 'mysql';

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
		'username',
		'password',
		'email',
		'options',

		// flags
		//
		'enabled_flag',
		'email_verified_flag',
		'admin_flag'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'username',
		'email',
		'options',

		// flags
		//
		'enabled_flag',
		'email_verified_flag',
		'admin_flag',

		// timestamps
		//
		'created_at',
		'updated_at'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'options' => Terms::class
	];

	//
	// relationship methods
	//

	/**
	 * Get this account's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->hasOne('App\Models\Users\User', 'id');
	}

	/**
	 * Get this account's relationship to its person.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function person() {
		return $this->hasOne('App\Models\Users\Person', 'id');
	}

	//
	// querying methods
	//

	/**
	 * Find if this user account is enabled.
	 *
	 * @return bool
	 */
	public function isEnabled(): bool {
		return strval($this->enabled_flag) == '1';
	}

	/**
	 * Find if this user account is an administrator account.
	 *
	 * @return bool
	 */
	public function isAdmin(): bool {
		return strval($this->admin_flag) == '1';
	}

	/**
	 * Find if the email address of this user account has been verified.
	 *
	 * @return bool
	 */
	public function hasBeenVerified(): bool {
		return strval($this->email_verified_flag) == '1';
	}

	/**
	 * Find if this user account has this option.
	 *
	 * @return bool
	 */
	public function hasOption($option): bool {
		return in_array($option, $this->options);
	}

	/**
	 * Find if this user account has this option.
	 *
	 * @return bool
	 */
	public function isAffiliate(): bool {
		return $this->user->is_affiliate;
	}

	/**
	 * Find if this user account has an associated email address.
	 *
	 * @return bool
	 */
	public function hasEmail(): bool {
		return $this->email != null &&  $this->email != '';
	}

	//
	// validation methods
	//

	/**
	 * Find if this new user account is valid.
	 *
	 * @return bool
	 */
	public function isTaken(&$errors, $anyEmail = false): bool {

		// check to see if username has been taken
		//
		if ($this->username) {
			if (in_array($this->username, self::INVALID_USERNAMES)) {
				$errors[] = 'The username "' . $this->username . '" may not be used.';
			}
			if (self::where('username', '=', $this->username)->exists()) {
				$errors[] = 'The username "' . $this->username . '" is already in use.';
			}
		}

		// check to see if email has been taken
		//
		if ($this->email) {
			if (self::emailInUse($this->email)) {
				$errors[] = 'The email address "' . $this->email . '" is already in use.';
			}
		}

		return (sizeof($errors) == 0);
	}

	/**
	 * Find if this user account is valid after a change.
	 *
	 * @return bool
	 */
	public function isValid(&$errors, $anyEmail = false): bool {

		// check to see if username has changed
		//
		$userAccount = self::find($this->id);
		if ($userAccount) {
			if ($this->username != $userAccount->username) {

				// check to see if username has been taken
				//
				if ($this->username) {
					if (in_array($this->username, self::INVALID_USERNAMES)) {
						$errors[] = 'The username "' . $this->username . '" may not be used.';
					}
					if (self::where('username', '=', $this->username)->exists()) {
						$errors[] = 'The username "' . $this->username . '" is already in use.';
					}
				}
			}
		} else {
			$errors[] = "User not found.";
		}

		// check to see if email has changed
		//
		$userAccount = self::find($this->id);
		if ($userAccount) {
			if ($this->email != $userAccount->email) {

				// check to see if email has been taken
				//
				if ($this->email) {
					if (self::emailInUse($this->email)) {
						$errors[] = 'The email address "' . $this->email . '" is already in use.';
					}
				}
			}
		} else {
			$errors[] = "User account not found.";
		}

		return (sizeof($errors) == 0);
	}

	/**
	 * Add this new user account, encrypting its password.
	 *
	 * @return void
	 */
	public function add() {
		
		// encrypt password
		//
		if ($this->password) {
			$encryption = config('app.password_encryption_method');
			$this->password = Password::getEncrypted($this->password, '{' . $encryption . '}');
		}

		// save changes
		//
		$this->save();

		return $this;
	}

	/**
	 * Change a user account's password.
	 *
	 * @param string $password
	 * @return void
	 */
	public function modifyPassword(string $password) {
		
		// encrypt password
		//
		$encryption = config('app.password_encryption_method');
		$this->password = Password::getEncrypted($password, '{' . $encryption . '}', $this->password);

		// save changes
		//
		$this->save();
		return $this;
	}

	//
	// static querying methods
	//

	/**
	 * Find a user account by its id or 'current'
	 *
	 * @param string $userId
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public static function find($userId): ?UserAccount {
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		return self::where('id', '=', $userId)->first();
	}

	/**
	 * Find a user account by its unique username
	 *
	 * @param string $username
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public static function getByUsername(string $username) {
		return UserAccount::where('username', '=', $username)->first();
	}

	/**
	 * Find a user account by its unique email address
	 *
	 * @param string $email
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public static function getByEmail(string $email) {
		return User::where('email', '=', $email)->first();
	}

	/**
	 * Find user account of current user.
	 *
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public static function current(): ?UserAccount {
		return self::find(Session::get('user_id'));
	}

	/**
	 * Find if an email address is in use in a user account.
	 *
	 * @param string $email
	 * @return bool
	 */
	public static function emailInUse($email): bool {
		$values = [];
		if (preg_match("/(\w*)(\+.*)(@.*)/", $email, $values)) {
			$email = $values[1] . $values[3];
		}

		foreach (self::all() as $account) {
			$values = [];
			if (preg_match("/(\w*)(\+.*)(@.*)/", $account->email, $values)) {
				$account->email = $values[1] . $values[3];
			}
			if (strtolower($email) == strtolower($account->email)) {
				return true;
			}
		}

		return false;		
	}

	/**
	 * Get the domain of an email address.
	 *
	 * @param string $email
	 * @return string
	 */
	static function getEmailDomain($email): string {
		$domain = implode('.',
			array_slice( preg_split("/(\.|@)/", $email), -2)
		);
		return strtolower($domain);
	}

	/**
	 * Get a unique username matching a particular pattern.
	 *
	 * @param string $username
	 * @return string
	 */
	public static function getUniqueUsername(string $username) {

		// check if username is taken
		//
		if (!self::getByUsername($username)) {
			return $username;
		}

		// attempt username permutations
		//
		for ($i = 1; $i <= self::MAXTRIES; $i++) {
			$uniqueName = $username . $i;

			if (!self::getByUsername($uniqueName)) {
				return $uniqueName;
			}
		}

		return false;
	}
}
