/******************************************************************************\
|                                                                              |
|                           technologies-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an item list view.                                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivitiesListView from '../../../../../views/sidebar/activities/lists/activities-list-view.js';
import TechnologiesListItemView from '../../../../../views/sidebar/activities/technologies/lists/technologies-list-item-view.js';

export default ActivitiesListView.extend({

	//
	// attributes
	//

	childView: TechnologiesListItemView
});