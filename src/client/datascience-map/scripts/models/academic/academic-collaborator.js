/******************************************************************************\
|                                                                              |
|                           academic-collaborator.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an academic collaborator.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Collaborator from '../collaborator.js';
import DateRangeQueryable from '../behaviors/date-range-queryable.js';

export default Collaborator.extend(_.extend({}, DateRangeQueryable, {

	//
	// parsing methods
	//

	parsePrimaryAffiliation(response) {
		if (response.unitName) {
			return response.unitName;
		}
		if (response.primaryUnitAffiliation) {
			return response.primaryUnitAffiliation.baseName;
		}
	},

	parseAffiliations(response) {
		let affiliations = [];
		if (response.nonPrimaryUnitAffiliations) {
			for (let i = 0; i < response.nonPrimaryUnitAffiliations.length; i++) {
				affiliations.push(response.nonPrimaryUnitAffiliations[i].baseName);
			}
		}
		return affiliations;
	},

	parse: function(response) {
		return {
			id: response.id,
			source: 'academic_analytics',

			// personal info
			//
			first_name: response.firstName? response.firstName : undefined,
			last_name: response.lastName? response.lastName : undefined,
			middle_name: response.middleName? response.middleName : undefined,
			image: undefined,

			// professional info
			//
			title: response.title? response.title : undefined,
			primary_affiliation: this.parsePrimaryAffiliation(response),
			affiliations: this.parseAffiliations(response),

			// research info
			//
			research_summary: response.researchSummary,
			research_interests: response.researchInterests,
			research_tools: response.researchTools,
			research_terms: response.researchTerms,

			// date info
			//
			start_date: new Date(response.startDate),
			end_date: new Date(response.endDate),

			// contact info
			//
			email: undefined,
			url: 'https://wisc.discovery.academicanalytics.com/scholar/stack/' + response.id + '/' + response.firstName + '-' + response.lastName
		};
	}
}));
