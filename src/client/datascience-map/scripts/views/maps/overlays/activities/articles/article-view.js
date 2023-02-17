/******************************************************************************\
|                                                                              |
|                               article-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a selectable, unscaled marker element.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivityView from '../../../../../views/maps/overlays/activities/activity-view.js';
import ArticleMarkerView from '../../../../../views/maps/overlays/activities/articles/article-marker-view.js';

export default ActivityView.extend({

	//
	// attributes
	//

	className: 'article',

	//
	// getting methods
	//

	getMarkerView: function() {
		return new ArticleMarkerView({
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