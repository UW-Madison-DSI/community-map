/******************************************************************************\
|                                                                              |
|                               person-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an item list view.                                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import '../../../../vendor/bootstrap/js/tab.js';
import BaseView from '../../../views/base-view.js';
import ProfileView from '../../../views/sidebar/people/profile/profile-view.js';
import AddressBar from '../../../utilities/web/address-bar.js';
import QueryString from '../../../utilities/web/query-string.js';

export default BaseView.extend({

	//
	// attributes
	//

	item: 'person',

	template: _.template(`

		<% if (editable) { %>
		<div class="buttons">
			<button class="edit-person btn btn-primary">
				<i class="fa fa-pencil"></i>Edit My Profile
			</button>
			<button class="return-to-map btn">
				<i class="fa fa-map"></i>Return To Map
			</button>
		</div>
		<% } %>

		<div class="info panel">
			<% if (closable) { %>
			<button class="btn" id="close" data-toggle="tooltip" title="Close" data-placement="right">
				<i class="fa fa-close"></i>
			</button>
			<% } %>

			<div class="title">
				<% if (!profile_photo_url) { %>
				<div class="icon">
					<% if (title && title == 'Professor') { %>
					<i class="fa fa-user-graduate"></i>
					<% } else { %>
					<i class="fa fa-user"></i>
					<% } %>
				</div>
				<% } else { %>
				<img class="profile-photo" src="<%= profile_photo_url %>" />
				<% } %>

				<div class="name">
					<% if (first_name) { %><span class="first-name"><%= first_name %></span><% } %>
					<% if (middle_name) { %><span class="middle-name"><%= middle_name %></span><% } %>
					<% if (last_name) { %><span class="last-name"><%= last_name %></span><% } %>
				</div>

				<% if (title || is_affiliate) { %>
				<div class="subtitle">
					<% if (title) { %><%= title.toTitleCase() %><% } %><% if (title && is_affiliate) { %>, <% } %><% if (is_affiliate) { %>Affiliate<% } %>
				</div>
				<% } %>
			</div>

			<ul class="nav nav-tabs" role="tablist">
				<li role="presentation" class="profile tab active" data-toggle="tooltip" title="Profile">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-info-circle"></i>
						<i class="fa fa-spinner spinning" style="display:none"></i>
					</a>
				</li>
			</ul>
		
			<div class="details"></div>
		</div>
	`),

	regions: {
		details: '.details'
	},

	events: {
		'click .nav-tabs > li > a': 'onClickTab',
		'click #close': 'onClickClose',
		'click .edit-person': 'onClickEditPerson',
		'click .return-to-map': 'onClickReturnToMap'
	},

	//
	// mouse event handling methods
	//

	onClickAddPerson: function() {
		this.getTopView().showAddPersonDialog();
	},

	//
	// querying methods
	//

	toCSV: function() {
		let csv = '';
		csv += 'First Name, ';
		csv += 'Middle Name, ';
		csv += 'Last Name, ';
		csv += 'Primary Affiliation, ';
		csv += 'Other Affiliations, ';
		csv += 'Interests ';
		csv += '\n';
		csv += (this.model.get('first_name') || '') + ',';
		csv += (this.model.get('middle_name') || '') + ',';
		csv += (this.model.get('last_name') || '') + ',';
		csv += (this.model.get('primary_affiliation') || '') + ',';
		csv += '"' + this.model.getSecondaryAffiliations().join(', ') + '",';
		csv += '"' + this.model.get('interests').join(', ') + '"';
		csv += '\n';
		return csv;
	},

	toJSON: function() {
		let data = [];
		data.push({
			'First Name': this.model.get('first_name'),
			'Middle Name': this.model.get('middle_name'),
			'Last Name': this.model.get('last_name'),
			'Primary Affiliation': this.model.get('primary_affiliation'),
			'Other Affiliations': this.model.getSecondaryAffiliations(),
			'Interests': this.model.get('interests')
		});
		return JSON.stringify(data, null, 4);
	},

	addQueryParams: function(params) {

		// add activity to params
		//
		if (this.info && this.info != 'profile') {
			params.set('info', this.info);
		}

		return params;
	},

	//
	// getting methods
	//

	getSearchParams: function() {
		let urlSearchParams = new URLSearchParams(window.location.search);
		return Object.fromEntries(urlSearchParams.entries());
	},

	getQueryParams: function() {
		let params = new URLSearchParams();
		this.addQueryParams(params);
		return params;
	},

	getMapView: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');
		return mainView.getChildView('mainbar');
	},

	getPersonView: function() {
		let mapView = this.getMapView();
		if (mapView.peopleView) {
			let personView = mapView.peopleView.children.findByModel(this.model);
			if (!personView) {
				personView = mapView.peopleView.children.findByIndex(0);
			}
			return personView;
		}
	},

	//
	// setting methods
	//

	setActiveTab: function(tab) {
		this.$el.find('li.active').removeClass('active');
		this.$el.find('li.' + tab.replace(/_/g, '-')).addClass('active');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');

		return {
			profile_photo_url: this.model.getProfilePhotoUrl(),
			other_affiliations: this.model.getSecondaryAffiliations(),
			is_affiliate: this.model.isAffiliate(),
			editable: this.options.editable,
			closable: !mainView.savedPeople != undefined && !this.options.editable
		};
	},

	onRender: function() {

		// set initial state
		//
		this.$el.find('li').hide();
		this.$el.find('li.profile').show();
		this.setActiveTab('profile');
		this.showProfile();

		// fetch model counts
		//
		this.showSpinner();
		this.model.clone().fetch({

			// callbacks
			//
			success: () => {
				this.hideSpinner();
			}
		});

		// add tooltip triggers
		//
		this.addTooltips();
	},

	showProfile: function() {
		this.showChildView('details', new ProfileView({
			model: this.model,
			query: this.options.query
		}));
	},

	showSpinner: function() {
		this.$el.find('.nav-tabs .profile .fa-info-circle').hide();
		this.$el.find('.nav-tabs .profile .fa-spinner').show();
	},

	hideSpinner: function() {
		this.$el.find('.nav-tabs .profile .fa-info-circle').show();
		this.$el.find('.nav-tabs .profile .fa-spinner').hide();
	},

	//
	// mouse event handling methods
	//

	onClickClose: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');
		let mapView = mainView.getChildView('mainbar');

		// reset address bar
		//
		AddressBar.clear({
			silent: mainView.options.person == null
		});

		if (mainView.savedPeople && mainView.savedPeople.length > 1) {

			// show group of people from previous search
			//
			mainView.clearSideBar();
			mainView.showPeople(mainView.savedPeople);

			// restore view from before person was clicked
			//
			mapView.popView();

			// restore search bar
			//
			mapView.setToolbarVisible('search', true);
		} else {

			// restore search bar to initial state
			//
			mapView.setToolbarVisible('search', true);
			mainView.clearSearch();
		}
	},

	onClickEditPerson: function() {
		let queryString = QueryString.get();

		// go to edit my profile view
		//
		Backbone.history.navigate("#my-profile/edit" + (queryString? '?' + queryString : ''), {
			trigger: true
		});
	},

	onClickReturnToMap: function() {

		// return to map view
		//
		Backbone.history.navigate("", {
			trigger: true
		});
	}
});