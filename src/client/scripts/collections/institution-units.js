/******************************************************************************\
|                                                                              |
|                           institution-units.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a base collection of institution units.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseCollection from '../collections/base-collection.js';
import InstitutionUnit from '../models/institution-unit.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: InstitutionUnit,
	url: config.servers.community_map + '/institution-units',

	//
	// querying methods
	//

	findByName: function(name) {
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.get('base_name') == name) {
				return model;
			}
		}
	},

	//
	// fetching methods
	//

	fetch(options) {
		return BaseCollection.prototype.fetch.call(this, _.extend({}, options, {
			url: this.url + (options && options.full? '/full' : ''),
			parse: true
		}));
	}
}, {

	//
	// static attributes
	//

	collection: null
});