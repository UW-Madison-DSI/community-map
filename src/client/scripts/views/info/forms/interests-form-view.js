/******************************************************************************\
|                                                                              |
|                            interests-form-view.js                            |
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
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import FormView from '../../forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'checkboxes panel',

	template: _.template(`
		<label>Topics:</label>
		<div id="all">
			<input type="checkbox" checked />
			<span class="name">All</span>
			<span class="badge">0</span>
		</div>
		<% for (let i = 0; i < interests.length; i++) { %>
		<div class="interest">
			<input value="<%= interests[i] %>" type="checkbox" checked />
			<span class="name"><%= interests[i] %></span>
			<span class="badge">0</span>
		</div>
		<% } %>
	`),

	templateContext: function() {
		return {
			interests: defaults.interests
		}
	},

	events: {
		'click #all input': 'onClickAll',
		'click #all .name': 'onClickAllName',
		'click .interest .icon': 'onClickName',
		'click .interest .name': 'onClickName',
		'click .interest input[type="checkbox"]': 'onClickCheckbox'
	},

	//
	// querying methods
	//

	numPeopleInterestedIn: function(people, interest) {
		let count = 0;
		for (let i = 0; i < people.length; i++) {
			if (people[i].isInterestedIn(interest)) {
				count++;
			}
		}
		return count;
	},

	//
	// rendering methods
	//

	showPeopleCounts: function(people) {
		this.$el.find('#all .badge').text(people.length);
		let badges = this.$el.find('.interest .badge');
		for (let i = 0; i < defaults.interests.length; i++) {
			let interest = defaults.interests[i];
			let badge = badges[i];
			$(badge).text(this.numPeopleInterestedIn(people, interest));
		}
	},

	checkAll: function() {
		this.$el.find('input[type="checkbox"]').prop('checked', true);
	},

	uncheckAll: function() {
		this.$el.find('input[type="checkbox"]').prop('checked', false);
	},

	//
	// mouse event handling methods
	//

	onClickAll: function() {
		let researchInterests;

		if (this.$el.find('#all input').is(':checked')) {
			this.checkAll();
			researchInterests = undefined;
		} else {
			this.uncheckAll();
			researchInterests = [];
		}

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(researchInterests);
		}
	},

	onClickAllName: function() {
		let researchInterests;

		if (!this.$el.find('#all input').is(':checked')) {
			this.checkAll();
			researchInterests = undefined;
		} else {
			this.uncheckAll();
			researchInterests = [];
		}

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(researchInterests);
		}
	},

	onClickName: function(event) {
		let interest = $(event.target).closest('.interest');
		this.uncheckAll();
		$(interest).find('input').prop('checked', true);

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(this.getResearchInterests());
		}
	},

	onClickCheckbox: function() {

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(this.getResearchInterests());
		}
	}
});