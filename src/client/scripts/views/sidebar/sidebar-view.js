/******************************************************************************\
|                                                                              |
|                                sidebar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a sidebar information view.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';
import TreeView from '../../views/items/trees/tree-view.js';
import FooterView from '../../views/layout/footer-view.js';
import QueryString from '../../utilities/web/query-string.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'welcome panel',

	template: _.template(`
		<img class="logo hidden-xs" src="<%= defaults.sidebar.logo %>" />

		<h1 id="title"><%= defaults.application.title %></h1>
		<h1 id="subtitle"><%= defaults.application.subtitle %></h1>

		<% if (defaults.application.tagline) { %>
		<div class="tagline panel"><%= defaults.application.tagline %></div>
		<% } %>

		<% if (defaults.application.subheading) { %>
		<hr />
		<div class="subheading panel"><%= defaults.application.subheading %></div>
		<% } %>

		<% if (!defaults.community) { %>
		<hr />
		<div class="communities panel">
			<p>View a specific community of interest: </p>
			<ul>
			<% for (let i = 0; i < defaults.communities.length; i++) { %>
				<% var community = defaults.communities[i]; %>
				<% var communityName = community.replace(/-/g, ' ').toTitleCase(); %>
				<li><a href="<%= community %>"><%= communityName %></a></li>
			<% } %>
			</ul>
		</div>
		<% } %>

		<% if (!defaults.sidebar || defaults.sidebar.interests) { %>
		<hr />
		<div class="interests panel">
			<%= defaults.sidebar.interests.label %>
			<br /><br />
			<div id="terms"></div>
		</div>
		<% } %>

		<% if (!defaults.sidebar || defaults.sidebar.appointments) { %>
		<hr />
		<div class="appointments panel">
			<%= defaults.sidebar.appointments.label %>
			<br /><br />
			<div id="appointments"></div>
		</div>
		<% } %>

		<% if (!defaults.sidebar || defaults.sidebar.affiliates) { %>
		<hr />
		<div class="affiliates panel" style="display:flex">
			<input type="checkbox"<% if (defaults.sidebar.affiliates.checked) { %> checked<% } %> style="margin-top:5px; margin-bottom:auto;" />
			<div style="margin-left:10px"><%= defaults.sidebar.affiliates.label %></div>
			<span class="count" style="float:right"><div class="badge">0</div></span>
		</div>
		<% } %>

		<% if (defaults.sidebar && defaults.sidebar.message) { %>
		<hr />
		<div class="collaboration panel">
			<%= defaults.sidebar.message %>
		</div>
		<% } %>

		<hr />

		<div id="footer"></div>
	`),

	regions: {
		'terms': '#terms',
		'appointments': '#appointments',
		'footer': '#footer'
	},

	events: {
		'click .affiliates input': 'onClickCheckbox'
	},

	//
	// constructor
	//
	
	initialize: function() {

		// create filter collections
		//
		this.terms = defaults.community? application.getCollection(window.community_defaults[defaults.community].terms) : [];
		this.appointments = application.getCollection(defaults.appointment_types);
	},

	//
	// querying methods
	//

	numPeopleWithTerm: function(term, except) {
		let count = 0;
		for (let i = 0; i < this.people.length; i++) {
			let person = this.people[i];
			if (person.hasTerm(term) == true) {
				if (!except) {
					count++;
				} else if (!except.includes(person)) {
					count++;
					except.push(person);
				}
			}
		}
		return count;
	},

	numPeopleWithAppointment: function(appointment, except) {
		let count = 0;
		for (let i = 0; i < this.people.length; i++) {
			let person = this.people[i];
			if (person.hasAppointment(appointment) == true) {
				if (!except) {
					count++;
				} else if (!except.includes(person)) {
					count++;
					except.push(person);
				}
			}
		}
		return count;
	},

	numAffiliates: function() {
		let count = 0;
		for (let i = 0; i < this.people.length; i++) {
			let person = this.people[i];
			if (person.isAffiliate()) {
				count++;
			}
		}
		return count;
	},

	//
	// getting methods
	//

	getSelectedTerms: function() {
		if (this.hasChildView('terms') && !this.getChildView('terms').isAllSelected()) {
			return this.getChildView('terms').getValues();
		}
	},

	getSelectedAppointments: function() {
		if (this.hasChildView('appointments') && !this.getChildView('appointments').isAllSelected()) {
			return this.getChildView('appointments').getValues();
		}
	},

	getShowAffiliates: function() {
		return this.$el.find('.affiliates input').is(':checked');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			affiliates: QueryString.value('affiliates')
		}
	},

	onRender: function() {
		if (!defaults.sidebar || defaults.sidebar.interests) {
			this.showTerms();
		}
		if (!defaults.sidebar || defaults.sidebar.appointments) {
			this.showAppointmentTypes();
		}

		this.showFooter();
	},

	showTerms: function() {
		this.showChildView('terms', new TreeView({
			collection: this.terms,
			sortWithCollection: false,
			expanded: defaults.sidebar.interests.expanded,
			checked: true,

			// callbacks
			//
			count: (term, except) => this.numPeopleWithTerm(term, except),
			onclick: () => this.onClickCheckbox()
		}));
	},

	showAppointmentTypes: function() {
		this.showChildView('appointments', new TreeView({
			collection: this.appointments,
			sortWithCollection: false,
			expanded: defaults.sidebar.appointments.expanded,
			checked: true,

			// callbacks
			//
			count: (appointment) => this.numPeopleWithAppointment(appointment),
			onclick: () => this.onClickCheckbox()
		}));
	},

	showAffiliates: function(showAffiliates) {
		let params = QueryString.toObject();
		params['affiliates'] = showAffiliates;
		QueryString.set(QueryString.encode(params));

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick({
				terms: this.getSelectedTerms(),
				appointments: this.getSelectedAppointments(),
				affiliates: showAffiliates
			});
		}
	},

	showPeopleCounts: function(people) {
		this.people = people;

		// show term counts
		//
		if (this.hasChildView('terms')) {
			this.getChildView('terms').showCounts();
		}
		if (this.hasChildView('appointments')) {
			this.getChildView('appointments').showCounts();
		}
		this.$el.find('.affiliates .count .badge').text(this.numAffiliates());
	},

	showFooter: function() {
		this.showChildView('footer', new FooterView());
	},

	//
	// mouse event handling methods
	//

	onClickCheckbox: function() {
		this.showAffiliates(this.getShowAffiliates());
	}
});