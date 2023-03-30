/******************************************************************************\
|                                                                              |
|                           awards-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a sidebar list view.                                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ActivitiesListItemView from '../../../../../views/items/activities/lists/activities-list-item-view.js';
import AwardDetailsView from '../../../../../views/items/activities/awards/lists/award-details-view.js';

export default ActivitiesListItemView.extend({

	//
	// attributes
	//

	template: _.template(`
		<% if (columns.includes('year')) { %>
		<td class="year">
			<%= year %>
		</td>
		<% } %>

		<% if (columns.includes('contributors')) { %>
		<td class="contributors">
			<%= contributors.length %>
		</td>
		<% } %>

		<% if (columns.includes('name')) { %>
		<td class="name">
			<div class="title">
				<span class="award icon">
					<i class="fa fa-trophy"></i>
				</span>

				<% if (name) { %>
				<a><%= name %></a>
				<% } %>

				<div class="expander">
					<button type="button" class="collapse btn btn-sm">
						<i class="fa fa-caret-up"></i>
					</button>
					<button type="button" class="expand btn btn-sm">
						<i class="fa fa-caret-down"></i>	
					</button>
				</div>
			</div>

			<div class="details"></div>
		</td>
		<% } %>
	`),

	//
	// rendering methods
	//

	showDetails: function() {
		this.showChildView('details', new AwardDetailsView({
			model: this.model
		}));
	}
});