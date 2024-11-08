/******************************************************************************\
|                                                                              |
|                           groupable-table-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract view for displaying groupable tables.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import SortableTableView from '../../../views/collections/tables/sortable-table-view.js';

export default SortableTableView.extend({

	//
	// grouping methods
	//

	markFirstRows: function(rows) {
		let sortColumnIndex = this.getSortColumnIndex();
		for (let row = 0; row <= rows.length; row++) {
			let cell = $(rows[row]).find('td')[sortColumnIndex];

			if (row == 0 || !$(cell).hasClass('duplicate')) {
				$(rows[row]).addClass('first');
			} else {
				$(rows[row]).removeClass('first');
			}
		}
	},

	markLastRows: function(rows) {
		for (let row = 0; row < rows.length; row++) {
			if ($(rows[row + 1]).hasClass('first')) {
				$(rows[row]).addClass('last');
			}
		}
		$(rows[rows.length - 1]).addClass('last');	
	},
	
	showSortColumn: function() {
		let rows = this.$el.find('tbody tr');

		// clear previous first classes
		//
		this.$el.find('tbody tr.first').removeClass('first');
		this.$el.find('tbody tr.last').removeClass('last');	

		// mark first and last rows of each group
		//
		this.markFirstRows(rows);
		this.markLastRows(rows);
	},

	markEvenOddGrouping: function(sortColumnIndex) {
		let rows = this.$el.find('tbody tr');
		let order = "even";

		// clear even odd classes
		//
		this.$el.find('.even').removeClass('even');
		this.$el.find('.odd').removeClass('odd');

		// add even odd classes
		//
		for (let row = 0; row <= rows.length; row++) {
			let cell = $(rows[row]).find('td')[sortColumnIndex];

			if (row == 0 || !$(cell).hasClass('duplicate')) {

				// switch from even to odd
				//
				order = order == "even"? "odd" : "even";
			}

			$(rows[row]).removeClass('even');
			$(rows[row]).removeClass('odd');
			$(rows[row]).addClass(order);
		}
	},

	markDuplicateCells: function(exceptions) {
		let columns = this.$el.find('thead th');
		let rows = this.$el.find('tbody tr');

		// remove duplicate tags
		//
		this.$el.find('.duplicate').removeClass('duplicate');

		// iterate over each column
		//
		for (let column = 0; column < columns.length; column++) {
			let item = this.$el.find('thead th')[column];

			// skip exception columns
			//
			if (exceptions) {
				if (this.constructor.cellContainsClass(item, exceptions)) {
					continue;
				}
			}

			// iterate over rows
			//
			for (let row = 0; row <= rows.length; row++) {
				let cell = $(rows[row]).find('td')[column];

				if (row == 0) {

					// always show first row
					//
					if ($(cell).hasClass('duplicate')) {
						$(cell).removeClass('duplicate');
					}
				} else {

					// check to see if item in row equals previous
					//
					let previous = $(rows[row - 1]).find('td')[column];

					if ($(cell).html() == $(previous).html()) {

						// hide cell contents
						//
						$(cell).addClass('duplicate');
					} else {

						// show cell contents
						//
						$(cell).removeClass('duplicate');						
					}
				}
			}
		}
	},

	showGrouping: function(exceptions) {
		this.markDuplicateCells(exceptions);

		// show sorting
		//
		if (this.sortBy) {
			let sortColumnIndex = this.getSortColumnIndex();
			if (sortColumnIndex) {
				this.showSortColumn(sortColumnIndex);
				this.markEvenOddGrouping(sortColumnIndex);
			}
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SortableTableView.prototype.onRender.call(this);

		// group items into contiguous blocks
		//
		if (application.options.show_grouping) {
			this.showGrouping(this.groupExcept);
		}
	},

	//
	// event handing methods
	//

	onSortEnd: function() {

		// call superclass method
		//
		SortableTableView.prototype.onSortEnd.call(this);

		// show grouping, if enabled
		//
		if (application.options.show_grouping) {
			this.showGrouping(this.groupExcept);
		}
	}
}, {

	//
	// static methods
	//

	cellContainsClass: function(item, classNames) {
		for (let i = 0; i < classNames.length; i++) {
			if ($(item).hasClass(classNames[i])) {
				return true;
			}
		}
		return false;
	}
});