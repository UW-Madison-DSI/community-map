/******************************************************************************\
|                                                                              |
|                            admin-sidebar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an admin sidebar information view.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';
import TreeView from '../../views/items/trees/tree-view.js';
import FooterView from '../../views/layout/footer-view.js';
import QueryString from '../../utilities/web/query-string.js';
import TimeUtils from '../../utilities/time/time-utils.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'welcome panel',

	template: _.template(`
		<img class="logo hidden-xs" src="images/logos/uw-crest.png" />

		<h1 id="title"><%= defaults.application.title %></h1>
		<h1 id="subtitle"><%= defaults.application.subtitle %></h1>

		<br />
		<hr />

		<div class="new-users panel">
			<label>New Users</label>
			<div>
				<span class="count"><div class="badge"><%= num_new_users_30 %></div></span>
				past month
			</div>
			<div>
				<span class="count"><div class="badge"><%= num_new_users_90 %></div></span>
				past 3 months
			</div>
			<div>
				<span class="count"><div class="badge"><%= num_new_users_180 %></div></span>
				past 6 months
			</div>
			<div>
				<span class="count"><div class="badge"><%= num_new_users_360 %></div></span>
				past year
			</div>
		</div>

		<hr />

		<div class="affiliates panel" style="display:flex">
			<input type="checkbox"<% if (affiliates) { %> checked<% } %> style="margin-top:5px; margin-bottom:auto;" />
			<div style="margin-left:10px"><%= defaults.sidebar.affiliates.label %></div>
			<span class="count"><div class="badge">0</div></span>
		</div>

		<hr />

		<div id="footer"></div>
	`),

	regions: {
		'footer': '#footer'
	},

	events: {
		'click .affiliates input': 'onClickAffiliates'
	},

	//
	// constructor
	//
	
	initialize: function() {

		// create filter collections
		//
		this.appointments = application.getCollection(defaults.appointment_types);
	},

	//
	// querying methods
	//

	numAffiliates: function() {
		let count = 0;
		for (let i = 0; i < this.collection.length; i++) {
			let person = this.collection.at(i);
			if (person.isAffiliate()) {
				count++;
			}
		}
		return count;
	},

	numNewUsers: function(numberOfDays) {
		let count = 0;
		for (let i = 0; i < this.collection.length; i++) {
			let person = this.collection.at(i);
			let date = new Date(person.get('created_at'));
			let elapsedTime = TimeUtils.getElapsedSeconds(date, new Date());
			if (elapsedTime < 3600 * 24 * numberOfDays) {
				count++;
			}
		}
		return count;
	},

	//
	// getting methods
	//

	getShowAffiliates: function() {
		return this.$el.find('.affiliates input').is(':checked');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			affiliates: QueryString.value('affiliates'),
			show_affiliates: true,
			num_new_users_30: this.numNewUsers(30),
			num_new_users_90: this.numNewUsers(90),
			num_new_users_180: this.numNewUsers(180),
			num_new_users_360: this.numNewUsers(360)
		}
	},

	onRender: function() {
		/*
		if (!defaults.sidebar || defaults.sidebar.show_appointments) {
			this.showAppointmentTypes();
		}
		*/
		this.showPeopleCounts();
		this.showFooter();
	},

	showAppointmentTypes: function() {
		this.showChildView('appointments', new TreeView({
			collection: this.appointments,
			sortWithCollection: false,
			expanded: defaults.sidebar.appointments.expanded,
			selected: true,

			// callbacks
			//
			count: (appointment) => this.numPeopleWithAppointment(appointment),
			onclick: () => this.onClickCheckbox()
		}));
	},

	showPeopleCounts: function() {

		// show term counts
		//
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

	onClickAffiliates: function() {
		let isChecked = this.$el.find('.affiliates input').is(':checked');
		if (isChecked) {
			this.parent.$el.addClass('affiliates-only');
		} else {
			this.parent.$el.removeClass('affiliates-only');
		}
	}
});