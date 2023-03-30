/******************************************************************************\
|                                                                              |
|                           places-list-item-view.js                           |
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

import ListItemView from '../../lists/list-item-view.js';
import AddressBar from '../../../../utilities/web/address-bar.js';

export default ListItemView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="title">
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

		<% if (medium_image) { %>
		<img class="thumbnail" src="<%= medium_image %>" />
		<% } %>
			
		<div class="details">

			<% if (departments && departments.length > 0) { %>
			<div class="departments">
				<label>Departments</label>
				<%= departments %>
			</div>
			<% } %>

			<% if (street_address) { %>
			<div class="street-address">
				<label>Street Address</label>
				<%= street_address %>
			</div>
			<% } %>

			<% if (departments.length == 0 && !street_address) { %>
			<div class="no-info">
				No additional information is available.
			</div>
			<% } %>
		</div>
	`),

	events: _.extend({}, ListItemView.prototype.events, {
		'click .thumbnail': 'onClick',
		'click a': 'onClickLink'
	}),

	//
	// mouse event handling methods
	//

	onClickLink: function() {
		let name = this.model.get('name');
		let baseUrl = location.origin + window.location.pathname;
		let queryString = '?query="' + name.replace(/ /g, '+') + '"';
		let url = baseUrl + queryString;
		let mapView = this.getParentView('split-view').getChildView('mainbar');

		// set address bar
		//
		AddressBar.set(url);

		// set search bar
		//
		mapView.getChildView('search').setQuery(name);

		// highlight building
		//
		mapView.showPlaces([this.model]);
	}
});