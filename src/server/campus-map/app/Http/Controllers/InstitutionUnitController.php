<?php
/******************************************************************************\
|                                                                              |
|                        InstitutionUnitController.php                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for fetching info about institution units.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

namespace App\Http\Controllers;

use App\Models\InstitutionUnit;
use App\Http\Controllers\Controller;

class InstitutionUnitController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get a unit.
	 *
	 * @param string $id - the id of the unit to get
	 * @return App\Models\InstitutionUnit
	 */
	public function getIndex(string $id) {

		// find institution unit by id
		//
		$institutionUnit = InstitutionUnit::find($id);
		if (!$institutionUnit) {
			return response("Institution unit not found.", 404);
		}

		return $institutionUnit;
	}

	/**
	 * Get all units.
	 *
	 * @return App\Models\InstitutionUnit[]
	 */
	public function getAll() {
		return InstitutionUnit::all();
	}
}