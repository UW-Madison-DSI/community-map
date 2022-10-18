/******************************************************************************\
|                                                                              |
|                              academic-award.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an academic award.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Award from '../../activities/award.js';
import Contributor from '../academic-person.js';
	
export default Award.extend({

	//
	// attributes
	//

	baseUrl: config.servers.academic + '/awards',

	//
	// parsing methods
	//

	parseContributors(data) {
		let contributors = [];
		for (let i = 0; i < data.length; i++) {
			contributors.push(new Contributor(data[i], {
				parse: true
			}));
		}
		return contributors;
	},

	parse: function(response, options) {
		return {
			id: response.id,
			name: response.name,
			organization: response.governingSocietyName,

			// parse date
			//
			year: response.activityYear,
			date: response.awardedOn? new Date(response.awardedOn) : null,

			// parse team
			//
			contributors: this.parseContributors(response.contributors, options),
		}
	}
});