/******************************************************************************\
|                                                                              |
|                           people-list-item-view.js                           |
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

import ListItemView from '../../../views/collections/tables/table-item-view.js';
import PeopleListItemDetailsView from '../../../views/items/people/people-list-item-details-view.js';

export default ListItemView.extend({

	//
	// attributes
	//

	tagName: 'tr',

	template: _.template(`
		<% if (!columns || columns.includes('department')) { %>
		<td class="department">
			<%= primary_affiliation %>
		</td>
		<% } %>

		<% if (!columns || columns.includes('first_name')) { %>
		<td class="first-name">
			<%= first_name %>
			<% if (middle_name) { %>
				<%= middle_name %>
			<% } %>
		</td>
		<% } %>

		<% if (!columns || columns.includes('last_name')) { %>
		<td class="last-name">
			<div class="title">
				<% if (last_name) { %>
				<a href="<%= url %>" target="_blank">
					<% if (last_name) { %><span class="last-name"><%= last_name %></span><% } %>
				</a>
				<% } %>
			</div>
		</td>
		<% } %>

		<% if (!columns || columns.includes('is_affiliate')) { %>
		<td class="is-affiliate">
			<input type="checkbox"<% if (is_affiliate) { %> checked<% } %>
		</td>
		<% } %>

		<% if (!columns || columns.includes('create-date')) { %>
		<td class="create-date">
			<%= created_at? created_at.format('yyyy/mm/dd') : '' %>
		</td>
		<% } %>
	`),

	regions: {
		details: '.details'
	},

	events: {
		'click .is-affiliate input': 'onClickIsAffiliate'
	},

	//
	// querying methods
	//

	className: function() {
		return this.model.isAffiliate()? 'affiliate' : undefined;
	},

	isAffiliate: function() {
		return this.$el.find('.is-affiliate input').is(':checked');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			columns: this.options.columns,
			primary_affiliation: this.model.getAffiliationName(),
			is_affiliate: this.model.isAffiliate(),
			created_at: this.model.has('created_at')? new Date(this.model.get('created_at')) : undefined,
			url: this.model.getUrl()
		};
	},

	showDetails: function() {
		this.showChildView('details', new PeopleListItemDetailsView({
			model: this.model
		}));
	},

	//
	// mouse event handling methods
	//

	onClickIsAffiliate: function() {
		this.model.save({
			is_affiliate: this.isAffiliate()
		});
	}
});