/******************************************************************************\
|                                                                              |
|                            affiliates-map-view.js                            |
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

// ui views
//
import OptionsBarView from '../../views/toolbars/options-bar-view.js';

export default KnowledgeMapView.extend({

	//
	// methods
	//

	start: function() {
		KnowledgeMapView.prototype.start.call(this);

		// show all if no search
		//
		if (window.location.search == '' && window.location.hash != '#home') {
			this.showAll();
		}
	},

	//
	// rendering methods
	//

	showToolbars: function() {

		// call superclass method
		//
		KnowledgeMapView.prototype.showToolbars.call(this);

		// show options toolbar
		//
		this.showChildView('options', new OptionsBarView({
			parent: this
		}));
	},

	showAll: function() {
		let department = this.departments.findByName('Data Science');
		this.showDepartmentPeople('academic_analytics', department, {

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