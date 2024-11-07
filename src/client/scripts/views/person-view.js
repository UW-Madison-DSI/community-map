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

import MainSplitView from '../views/main-split-view.js';
import PeopleMapView from '../views/maps/people-map-view.js';

export default MainSplitView.extend({

	//
	// methods
	//

	getMainBarView: function() {
		return new PeopleMapView({
			el: this.$el.find('.mainbar')[0],
			latitude: defaults.map.latitude,
			longitude: defaults.map.longitude,
			zoom_level: defaults.map.zoom_level,
			grid: null,
			map_kind: 'map',
			parent: this,

			// callbacks
			//
			onstart: () => {
				this.onStart();

				// hide search bar
				//
				this.getChildView('mainbar').setToolbarVisible('search', false);
			}
		});
	},

	onStart: function() {

		// clear cache
		//
		application.reset();

		// show person's profile view
		//
		this.showPerson(this.model, {
			editable: false,
			zoom_to: true
		});
	}
});