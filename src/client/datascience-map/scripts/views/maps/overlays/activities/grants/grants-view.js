/******************************************************************************\
|                                                                              |
|                                 grants-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a collection of grants.                        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivitiesView from '../../../../../views/maps/overlays/activities/activities-view.js';
import GrantView from '../../../../../views/maps/overlays/activities/grants/grant-view.js';

export default ActivitiesView.extend({

	//
	// attributes
	//

	className: 'grants',
	childView: GrantView
});