/******************************************************************************\
|                                                                              |
|                      academic-conference-proceedings.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of academic conference proceedings.    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ConferenceProceedings from '../../activities/conference-proceedings.js';
import ConferenceProceeding from '../../../models/academic/activities/academic-conference-proceeding.js';

export default ConferenceProceedings.extend({

	//
	// attributes
	//

	model: ConferenceProceeding,

	//
	// fetching methods
	//

	fetchByPerson(person, options) {
		return this.fetch(_.extend({}, options, {
			url: config.servers.academic + '/people/' + person.get('id') + '/conference-proceedings',
			parse: true
		}));
	},

	fetchByTitle(title, options) {
		return this.fetch(_.extend({}, options, {
			url: config.servers.academic + '/conference-proceedings?title=' + encodeURIComponent(title),
			parse: true
		}));
	}
});