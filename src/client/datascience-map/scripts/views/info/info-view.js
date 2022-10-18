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

export default BaseView.extend({

	//
	// attributes
	//

	className: 'welcome panel',

	template: _.template(`
		<img class="logo" src="images/uw-crest.png" />

		<h1 id="title"><%= defaults.application.title %></h1>
		<h1 id="subtitle"><%= defaults.application.subtitle %></h1>

		<div class="subheading">
			<%= defaults.application.subheading %>
		</div>

		<div class="panel">
			Select the items of interest to you:
			<br /><br />
			<div id="terms"></div>
		</div>
	`),

	regions: {
		'terms': '#terms'
	},

	/*
	events: {
		'click input[type="checkbox"]': 'onClickCheckbox'
	},
	*/

	//
	// constructor
	//
	
	initialize: function() {

		// create filter collections
		//
		this.terms = application.getCollection(defaults.terms);
		/*
		this.applications = application.getCollection(defaults.applications);
		this.interests = application.getCollection(defaults.interests);
		this.tools = application.getCollection(defaults.tools);
		*/
	},

	//
	// querying methods
	//

	/*
	numPeopleInApplication: function(application) {
		let count = 0;
		for (let i = 0; i < this.people.length; i++) {
			if (this.people[i].isInApplication(application) == true) {
				count++;
			}
		}
		return count;
	},

	numPeopleInterestedIn: function(interest) {
		let count = 0;
		for (let i = 0; i < this.people.length; i++) {
			if (this.people[i].isInterestedIn(interest) == true) {
				count++;
			}
		}
		return count;
	},

	numPeopleUsing: function(tool) {
		let count = 0;
		for (let i = 0; i < this.people.length; i++) {
			if (this.people[i].isUsing(tool) == true) {
				count++;
			}
		}
		return count;
	},
	*/

	numPeopleWithTerm: function(term) {
		let count = 0;
		for (let i = 0; i < this.people.length; i++) {
			if (this.people[i].hasTerm(term) == true) {
				count++;
			}
		}
		return count;
	},

	//
	// getting methods
	//

	/*
	getSelectedApplications: function() {
		if (!this.getChildView('applications').isAllSelected()) {
			return this.getChildView('applications').getValues();
		}
	},

	getSelectedInterests: function() {
		if (!this.getChildView('interests').isAllSelected()) {
			return this.getChildView('interests').getValues();
		}
	},

	getSelectedTools: function() {
		if (!this.getChildView('tools').isAllSelected()) {
			return this.getChildView('tools').getValues();
		}
	},
	*/

	getSelectedTerms: function() {
		if (!this.getChildView('terms').isAllSelected()) {
			return this.getChildView('terms').getValues();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showTerms();
		/*
		this.showApplications();
		this.showInterests();
		this.showTools();
		*/
	},

	showTerms: function() {
		this.showChildView('terms', new TreeView({
			collection: this.terms,
			sortWithCollection: false,
			expanded: defaults.expanded,

			// callbacks
			//
			count: (term) => this.numPeopleWithTerm(term),
			// count: (application) => this.numPeopleInApplication(application),
			onclick: () => this.onClickCheckbox()
		}));
	},

	/*
	showApplications: function() {
		this.showChildView('applications', new TreeView({
			collection: this.applications,
			sortWithCollection: false,

			// callbacks
			//
			count: (term) => this.numPeopleWithTerm(term),
			// count: (application) => this.numPeopleInApplication(application),
			onclick: () => this.onClickCheckbox()
		}));
	},

	showInterests: function() {
		this.showChildView('interests', new TreeView({
			collection: this.interests,
			sortWithCollection: false,

			// callbacks
			//
			count: (term) => this.numPeopleWithTerm(term),
			// count: (interest) => this.numPeopleInterestedIn(interest),
			onclick: () => this.onClickCheckbox()
		}));
	},

	showTools: function() {
		this.showChildView('tools', new TreeView({
			collection: this.tools,
			sortWithCollection: false,

			// callbacks
			//
			count: (term) => this.numPeopleWithTerm(term),
			// count: (tool) => this.numPeopleUsing(tool),
			onclick: () => this.onClickCheckbox()
		}));
	},
	*/

	showPeopleCounts: function(people) {
		this.people = people;
		/*
		this.getChildView('applications').showCounts();
		this.getChildView('interests').showCounts();
		this.getChildView('tools').showCounts();
		*/
		this.getChildView('terms').showCounts();
	},

	//
	// mouse event handling methods
	//

	onClickCheckbox: function() {

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick({
				terms: this.getSelectedTerms()
				/*
				applications: this.getSelectedApplications(),
				interests: this.getSelectedInterests(),
				tools: this.getSelectedTools()
				*/
			});
		}
	}
});