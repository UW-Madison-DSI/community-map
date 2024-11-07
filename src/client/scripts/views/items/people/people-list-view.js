/******************************************************************************\
|                                                                              |
|                             people-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a list of people.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import SortableTableView from '../../../views/collections/tables/sortable-table-view.js';
import PeopleListItemView from '../../../views/items/people/people-list-item-view.js';

export default SortableTableView.extend({

	//
	// attributes
	//

	tagName: 'table',
	className: 'people',
	childView: PeopleListItemView,

	template: _.template(`
		<thead>
			<% if (!columns || columns.includes('department')) { %>
			<th class="department">
				Department
			</th>
			<% } %>

			<% if (!columns || columns.includes('first_name')) { %>
			<th class="first-name">
				First
			</th>
			<% } %>

			<% if (!columns || columns.includes('last_name')) { %>
			<th class="last-name">
				Last
			</th>
			<% } %>

			<% if (!columns || columns.includes('is_affiliate')) { %>
			<th class="is-affiliate">
				Affiliate
			</th>
			<% } %>

			<% if (!columns || columns.includes('create-date')) { %>
			<th class="create-date">
				Created
			</th>
			<% } %>
		</thead>
		<tbody>
		</tbody>
	`),

	// sorting column
	//
	sortBy: ['create-date', 'descending'],

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return {
			model: model,
			parent: this,
			columns: this.options.columns,

			// callbacks
			//
			onclick: this.options.onclick,
			onmouseover: this.options.onmouseover,
			onmouseleave: this.options.onmouseleave
		};
	},

	templateContext: function() {
		return {
			columns: this.options.columns
		};
	}
});