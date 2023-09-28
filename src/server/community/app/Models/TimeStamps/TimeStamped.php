<?php
/******************************************************************************\
|                                                                              |
|                                TimeStamped.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a base class with create and update           |
|        time stamps.                                                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

namespace App\Models\TimeStamps;

use App\Models\BaseModel;

class TimeStamped extends BaseModel
{	
	// use non-standard timestamp field names
	//
	const CREATED_AT = 'created_at';
	const UPDATED_AT = 'updated_at';
	const DELETED_AT = 'deleted_at';

	/**
	 * Enable default timestamps.
	 *
	 * @return bool
	 */
	public $timestamps = true;

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

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
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
	];
}
