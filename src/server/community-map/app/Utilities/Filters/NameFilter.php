<?php
/******************************************************************************\
|                                                                              |
|                                NameFilter.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for filtering by name (string).                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

namespace App\Utilities\Filters;

use Illuminate\Http\Request;

class NameFilter
{
	/**
	 * Apply name filter to query.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Database\Query\Builder $query - the query to apply filters to
	 * @return Illuminate\Database\Query\Builder
	 */
	static function applyTo(Request $request, $query) {

		// parse parameters
		//
		$name = $request->input('name', null);

		// add name filter to query
		//
		if ($name) {
	 		if (str_contains($name, ' ')) {
				$names = explode(' ', $name);

				// first and last name is specified
				//
				if (count($names) == 2) {
					$firstName = $names[0];
					$lastName = $names[1];	
					$query = $query->where('first_name', '=', $firstName)
						->where('last_name', '=', $lastName);

				// first, middle, and last name is specified
				//
				} else {
					$firstName = $names[0];
					$middleName = $names[1];
					$lastName = $names[count($names) - 1];	
					$query = $query->where('first_name', '=', $firstName)
						->where('middle_name', '=', $middleName)
						->where('last_name', '=', $lastName);
				}
			} else {

				// only one name is specified
				//
				$query->where(function($query) use ($name) {
					$query->where('first_name', '=', $name)
						->orWhere('middle_name', '=', $name)
						->orWhere('last_name', '=', $name);
				});
			}
		}

		return $query;
	}
}