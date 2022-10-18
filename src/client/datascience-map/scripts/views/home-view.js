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

import WelcomeView from './welcome-view.js';
import KnowledgeMapView from './maps/knowledge-map-view.js';
import Person from '../models/academic/academic-person.js';

export default WelcomeView.extend({

	//
	// methods
	//

	getMainBarView: function() {
		return new KnowledgeMapView({
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

				// set initial state
				//
				this.getChildView('mainbar').hideSearchBar();
			}
		});
	},

	onStart: function() {
		new Person({
			id: application.session.user.get('id')
		}).fetch({

			// callbacks
			//
			success: (model) => {
				this.showPerson(model, {
					editable: true
				});
			}
		})
	}
});