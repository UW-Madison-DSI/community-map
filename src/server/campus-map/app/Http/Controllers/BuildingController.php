<?php
/******************************************************************************\
|                                                                              |
|                            BuildingController.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for fetching info about buildings.               |
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

use App\Models\Building;
use App\Http\Controllers\Controller;

class BuildingController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get a building.
	 *
	 * @param string $id - the id of the grant to get
	 * @return App\Models\Building
	 */
	public function getIndex(string $id) {

		// find building by id
		//
		$building = Building::find($id);
		if (!$building) {
			return response("Building not found.", 404);
		}

		return $building;
	}

	/**
	 * Get all buildings.
	 *
	 * @return App\Models\Building[]
	 */
	public function getAll() {
		return Building::all();
	}
}