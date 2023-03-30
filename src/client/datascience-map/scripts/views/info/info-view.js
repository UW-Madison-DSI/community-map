/******************************************************************************\
|                                                                              |
|                                info-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a simple info view.                                      |
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
		<img class="logo hidden-xs" src="images/uw-crest.png" />

		<h1 id="title"><%= defaults.application.title %></h1>
		<h1 id="subtitle"><%= defaults.application.subtitle %></h1>

		<div class="subheading">
			<%= defaults.application.subheading %>
		</div>

		<div class="interests panel">
			Select the items of interest to you:
			<br /><br />
			<div id="terms"></div>
		</div>

		<div class="appointments panel">
			Select the appointment types of interest to you:
			<br /><br />
			<div id="appointments"></div>
		</div>

		<div class="affiliates panel">
			<input type="checkbox"<% if (affiliates) { %> checked<% } %>/>
			<span class="count" style="float:right"><div class="badge">0</div></span>
			<span style="margin-left:10px">Show members of the <a href="https://datascience.wisc.edu/dsi-affiliates" target="_blank">Data Science Institute Affiliates</a> program.</span>
		</div>

		<hr />

		<div class="collaboration panel">
			Would you like collaborate on your data science project?  Connect with us through our <a href="https://datascience.wisc.edu/institute/pathways-to-collaboration/" target="_blank">Data Science Services</a> program.
		</div>

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
		this.terms = application.getCollection(defaults.terms);
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
		if (!this.getChildView('terms').isAllSelected()) {
			return this.getChildView('terms').getValues();
		}
	},

	getSelectedAppointments: function() {
		if (!this.getChildView('appointments').isAllSelected()) {
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
			affiliates: QueryString.getParam('affiliates')
		}
	},

	onRender: function() {
		this.showTerms();
		this.showAppointmentTypes();
		this.showFooter();
	},

	showTerms: function() {
		this.showChildView('terms', new TreeView({
			collection: this.terms,
			sortWithCollection: false,
			expanded: defaults.expanded.terms,

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
			expanded: defaults.expanded.appointment_types,

			// callbacks
			//
			count: (appointment) => this.numPeopleWithAppointment(appointment),
			onclick: () => this.onClickCheckbox()
		}));
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
		let showAffiliates = this.getShowAffiliates();
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
	}
});