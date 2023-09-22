/******************************************************************************\
|                                                                              |
|                                home-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level view of our application.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Person from '../models/academic/academic-person.js';
import MainSplitView from '../views/main-split-view.js';
import AffiliatesMapView from '../views/maps/affiliates-map-view.js';

export default MainSplitView.extend({

	//
	// methods
	//

	getMainBarView: function() {
		return new AffiliatesMapView({
			el: this.$el.find('.mainbar')[0],
			latitude: 43.0740,
			longitude: 89.406,
			zoom_level: 16,
			grid: null,
			map_kind: 'map',
			parent: this,

			// callbacks
			//
			onstart: () => {
				this.onStart();

				// hide search bar
				//
				this.getChildView('mainbar').hideSearchBar();
			}
		});
	},

	onStart: function() {

		// clear cache
		//
		application.reset();

		// show person
		//
		new Person({
			id: this.options.person.get('id')
		}).fetch({

			// callbacks
			//
			success: (model) => {
				this.showPerson(model, {
					editable: false,
					zoom_to: true
				});
			}
		});
	}
});