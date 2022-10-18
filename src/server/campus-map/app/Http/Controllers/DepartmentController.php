<?php
/******************************************************************************\
|                                                                              |
|                           DepartmentController.php                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for fetching info about departments.             |
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

use App\Models\Department;
use App\Http\Controllers\Controller;

class DepartmentController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get a unit.
	 *
	 * @param string $id - the id of the unit to get
	 * @return App\Models\Department
	 */
	public function getIndex(string $id) {

		// find department by id
		//
		$department = Department::find($id);
		if (!$department) {
			return response("Department unit not found.", 404);
		}

		return $department;
	}

	/**
	 * Get all department.
	 *
	 * @return App\Models\Department[]
	 */
	public function getAll() {
		return Department::all();
	}
}