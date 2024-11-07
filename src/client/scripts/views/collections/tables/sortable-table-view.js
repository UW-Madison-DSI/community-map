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
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import TableView from '../../../views/collections/tables/table-view.js';
import '../../../../vendor/jquery/tablesorter/js/jquery.tablesorter.js';

export default TableView.extend({

	//
	// sorting methods
	//

	getTableColumnIndex: function(className) {
		let tableHeaders = this.$el.find('th');
		for (let i = 0; i < tableHeaders.length; i++) {
			let tableHeader = tableHeaders[i];
			let tableHeaderClass = $(tableHeader).attr('class');
			if (tableHeaderClass) {
				let classNames = tableHeaderClass.split(' ');
				if (classNames.includes(className)) {
					return i;
				}
			}
		}
	},

	setSortColumn: function(className, direction) {
		let index = this.getTableColumnIndex(className);

		// set sorting on specified column
		//
		if (index != undefined) {
			if (!this.sorting) {
				this.sorting = {};
			}
			switch (direction) {
				case 'ascending':
					this.sorting.sortList = [[index, 0]];
					break;
				case 'descending':
					this.sorting.sortList = [[index, 1]];
					break;
			}
		}

		// apply table sorter plug-in
		//
		this.$el.tablesorter(this.sorting);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		TableView.prototype.onRender.call(this);

		// apply table sorter plug-in
		//
		if (this.sortBy) {
			this.setSortColumn(this.sortBy[0], this.sortBy[1]);
		}
	}
});