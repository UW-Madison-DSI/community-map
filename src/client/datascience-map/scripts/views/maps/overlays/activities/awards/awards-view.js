/******************************************************************************\
|                                                                              |
|                                 awards-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a collection of awards.                        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivitiesView from '../../../../../views/maps/overlays/activities/activities-view.js';
import AwardView from '../../../../../views/maps/overlays/activities/awards/award-view.js';

export default ActivitiesView.extend({

	//
	// attributes
	//

	className: 'awards',
	childView: AwardView
});