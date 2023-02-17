/******************************************************************************\
|                                                                              |
|                                grant-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a selectable, unscaled marker element.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivityView from '../../../../../views/maps/overlays/activities/activity-view.js';
import GrantMarkerView from '../../../../../views/maps/overlays/activities/grants/grant-marker-view.js';

export default ActivityView.extend({

	//
	// attributes
	//

	className: 'grant',

	//
	// getting methods
	//

	getMarkerView: function() {
		return new GrantMarkerView({
			model: this.model,
			parent: this,

			// callbacks
			//
			onselect: () => {
				this.select();
			},
			ondeselect: () => {
				this.deselect();
			}
		});
	}
});