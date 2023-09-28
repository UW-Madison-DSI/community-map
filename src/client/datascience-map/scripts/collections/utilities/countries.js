/******************************************************************************\
|                                                                              |
|                                    countries.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of countries.                          |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Country from '../../models/utilities/country.js';
import NamedItems from '../../collections/utilities/named-items.js';

export default NamedItems.extend({

	//
	// Backbone attributes
	//

	model: Country,
	url: config.servers.community_map + '/countries'
});