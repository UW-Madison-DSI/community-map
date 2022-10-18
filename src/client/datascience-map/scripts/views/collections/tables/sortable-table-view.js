/******************************************************************************\
|                                                                              |
|                            sortable-table-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract view for displaying sortable tables.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2022, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableView from '../../../views/collections/tables/table-view.js';
import '../../../../vendor/jquery/tablesorter/js/jquery.tablesorter.js';

export default TableView.extend({

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		TableView.prototype.onRender.call(this);

		// apply table sorter plug-in
		//
		this.$el.tablesorter(this.sorting);
	}
});