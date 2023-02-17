/******************************************************************************\
|                                                                              |
|                               home-map-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a map view showing a campus affiliates map.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import KnowledgeMapView from '../../views/maps/knowledge-map-view.js';

export default KnowledgeMapView.extend({

	//
	// methods
	//

	start: function() {
		KnowledgeMapView.prototype.start.call(this);

		// show affiliates if no search
		//
		if (window.location.search == '') {
			this.showHome();
		}
	},

	//
	// rendering methods
	//

	showHome: function() {
		this.showPerson(application.session.user, {

			// callbacks
			//
			success: () => {
				if (this.options.onstart) {
					this.options.onstart();
				}
			}
		});
	}
});