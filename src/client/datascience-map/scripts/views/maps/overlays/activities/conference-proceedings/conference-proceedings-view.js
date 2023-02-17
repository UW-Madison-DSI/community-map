/******************************************************************************\
|                                                                              |
|                       conference-proceedings-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a collection of books.                         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivitiesView from '../../../../../views/maps/overlays/activities/activities-view.js';
import ConferenceProceedingView from '../../../../../views/maps/overlays/activities/conference-proceedings/conference-proceeding-view.js';

export default ActivitiesView.extend({

	//
	// attributes
	//

	className: 'conference-proceedings',
	childView: ConferenceProceedingView
});