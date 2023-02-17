/******************************************************************************\
|                                                                              |
|                             book-chapters-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a collection of book chapters.                 |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivitiesView from '../../../../../views/maps/overlays/activities/activities-view.js';
import BookChapterView from '../../../../../views/maps/overlays/activities/book-chapters/book-chapter-view.js';

export default ActivitiesView.extend({

	//
	// attributes
	//

	className: 'book-chapters',
	childView: BookChapterView
});