/******************************************************************************\
|                                                                              |
|                          academic-collaborators.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of academic collaborators.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Collaborators from '../collaborators.js';
import AcademicCollaborator from '../../models/academic/academic-collaborator.js';

export default Collaborators.extend({

	//
	// attributes
	//

	model: AcademicCollaborator,

	//
	// fetching methods
	//

	fetchByPerson(person, options) {
		return this.fetch(_.extend({}, options, {
			url: config.servers.academic + '/people/' + person.get('id') + '/collaborators',
			parse: true
		}));
	},
});