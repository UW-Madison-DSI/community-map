/******************************************************************************\
|                                                                              |
|                               departments.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of departments.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseCollection from '../collections/base-collection.js';
import Department from '../models/department.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Department,
	url: config.servers.campus_map + '/departments',

	//
	// querying methods
	//

	findByName: function(name) {
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.get('name') == name) {
				return model;
			}
		}
	}
});