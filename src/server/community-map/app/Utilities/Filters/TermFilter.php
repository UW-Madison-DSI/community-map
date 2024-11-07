<?php
/******************************************************************************\
|                                                                              |
|                               TermFilter.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for filtering by topic.                        |
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

class TermFilter
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
		$term = $request->input('term', null);
		if (!$term) {
			return $query;
		}

		// parse parameters
		//
		$exact = $request->input('exact', false);

		// add term to query
		//
		if ($exact) {
			$query = $query->where(function($query) use ($term) {
				$query->where('research_summary', 'like', '%' . $term . ',%')
					->orWhere('research_terms', 'like', '%' . $term . ',%')
					->orWhere('research_interests', 'like', '%' . $term . ',%')

					// add spaces
					//
					->orWhere('research_summary', 'like', '%' . $term . ' %')
					->orWhere('research_terms', 'like', '%' . $term . ' %')
					->orWhere('research_interests', 'like', '%' . $term . ' %');
			});
		} else {
			$query = $query->where(function($query) use ($term) {
				$query->where('research_summary', 'like', '%' . $term . '%')
					->orWhere('research_terms', 'like', '%' . $term . '%')
					->orWhere('research_interests', 'like', '%' . $term . '%');
			});
		}

		return $query;
	}
}