<?php
/******************************************************************************\
|                                                                              |
|                           CountryController.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for country information.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

namespace App\Http\Controllers\Utilities;

use Illuminate\Http\Request;
use App\Models\Utilities\Country;
use App\Http\Controllers\Controller;

class CountryController extends Controller
{
	/**
	 * Get all countries.
	 *
	 * @return App\Models\Utilities\Country[]
	 */
	public function getAll() {
		$countries = Country::all();
		return $countries;
	}
}