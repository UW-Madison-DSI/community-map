/******************************************************************************\
|                                                                              |
|                                table-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view for displaying a table.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import ListView from '../../../views/collections/lists/list-view.js';
import TableItemView from '../../../views/collections/tables/table-item-view.js';

export default ListView.extend({

	//
	// attributes
	//

	tagName: 'table',

	// views
	//
	childView: TableItemView,
	childViewContainer: 'tbody',
	emptyView: BaseView.extend({
		template: _.template("No items.")
	}),

	//
	// constuctor
	//

	initialize: function() {

		// update view on collection change
		//
		this.listenTo(this.collection, 'remove', this.update, this);
	}
});