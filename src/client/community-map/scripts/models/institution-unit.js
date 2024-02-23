/******************************************************************************\
|                                                                              |
|                            institution-unit.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a department.                                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseModel from '../models/base-model.js';

export default BaseModel.extend({

	//
	// ajax attributes
	//

	idAttribute: 'id',
	urlRoot: config.servers.academic + '/institution_units',

	//
	// attributes
	//

	defaults: {
		id: undefined,
		name: undefined,
		base_name: undefined,
		institution_id: undefined,
		is_primary: undefined,
		type: undefined,
		num_people: undefined
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {
		return {
			id: response.id,
			source: 'academic_analytics',

			// model info
			//
			name: response.name,
			base_name: response.baseName,
			institution_id: response.institutionId,
			is_primary: response.isPrimary,
			type: response.type,
			building: response.building,
			num_people: response.numPeople,
			num_affiliations: response.numAffiliations
		}
	}
});