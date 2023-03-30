/******************************************************************************\
|                                                                              |
|                              books-details-view.js                           |
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

import ActivityDetailsView from '../../../../../views/items/activities/activity-details-view.js';

export default ActivityDetailsView.extend({

	//
	// attributes
	//

	template: _.template(`
		<% if (publisher) { %>
		<div class="publisher">
			<label>Publisher</label>
			<%= publisher %>
		</div>
		<% } %>

		<% if (isbn) { %>
		<div class="isbn">
			<label>ISBN</label>
			<%= isbn %>
		</div>
		<% } %>

		<% if (publication_date) { %>
		<div class="publication-date">
			<label>Publication Date</label>
			<%= publication_date.format('shortDate') %>
		</div>
		<% } %>

		<% if (contributors.length > 0) { %>
		<div class="contributors">
			<label>Contributors</label>
			<%= contributors.join(', ') %>
		</div>
		<% } %>

		<% if (abstract) { %>
		<div class="abstract">
			<label>Abstract</label>
			<%= abstract %>
		</div>
		<% } %>
	`)
});