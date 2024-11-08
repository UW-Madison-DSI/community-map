/******************************************************************************\
|                                                                              |
|                                 building.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a building.                                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseModel from '../models/base-model.js';
import Vector2 from '../utilities/math/vector2.js';
import Bounds2 from '../utilities/bounds/bounds2.js';

export default BaseModel.extend({

	//
	// ajax attributes
	//

	idAttribute: 'id',
	urlRoot: config.servers.campus_map + '/buildings',

	//
	// attributes
	//

	defaults: {
		id: undefined,
		name: undefined,
		building_number: undefined,
		departments: undefined,
		description: undefined,
		hours: undefined,
		geojson: undefined,
		medium_image: undefined,
		thumb_image: undefined,
		latlng: undefined,
		object_type: undefined,
		street_address: undefined,
		tags: undefined,
		thumbnail: undefined
	},

	//
	// getting methods
	//

	getCenter: function(coordinates) {
		let bounds = new Bounds2();
		for (let i = 0; i < coordinates.length; i++) {
			let x = coordinates[i][1];
			let y = coordinates[i][0];
			let vertex = new Vector2(x, y);
			bounds.extendTo(vertex);
		}
		return bounds.center();
	},

	getLatLng: function() {
		let latlng = this.get('latlng');
		return new Vector2(latlng[0], latlng[1]);
	}
});