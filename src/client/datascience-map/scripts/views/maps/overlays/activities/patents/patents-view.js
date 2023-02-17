/******************************************************************************\
|                                                                              |
|                               patents-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a collection of patents.                       |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivitiesView from '../../../../../views/maps/overlays/activities/activities-view.js';
import PatentView from '../../../../../views/maps/overlays/activities/patents/patent-view.js';

export default ActivitiesView.extend({

	//
	// attributes
	//

	className: 'patents',
	childView: PatentView
});