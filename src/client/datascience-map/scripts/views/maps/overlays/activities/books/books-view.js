/******************************************************************************\
|                                                                              |
|                                 books-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a collection of books.                         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivitiesView from '../../../../../views/maps/overlays/activities/activities-view.js';
import BookView from '../../../../../views/maps/overlays/activities/books/book-view.js';

export default ActivitiesView.extend({

	//
	// attributes
	//

	className: 'books',
	childView: BookView
});