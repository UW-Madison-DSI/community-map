/******************************************************************************\
|                                                                              |
|                                welcome-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level view of our application.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import SplitView from '../views/layout/split-view.js';
import InfoView from '../views/info/info-view.js';
import PersonView from '../views/items/people/person-view.js';
import AffiliatesMapView from '../views/maps/affiliates-map-view.js';

export default SplitView.extend({

	//
	// attributes
	//

	orientation: 'horizontal',
	flipped: false,
	sizes: [35, 65],

	//
	// setting methods
	//

	setYear: function(value) {
		if (this.getChildView('sidebar').setYear) {
			this.getChildView('sidebar').setYear(value);
		}
		this.getChildView('mainbar').setYear(value);
	},

	setRange: function(values) {
		if (this.getChildView('sidebar').setRange) {
			this.getChildView('sidebar').setRange(values);
		}
		this.getChildView('mainbar').setRange(values);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SplitView.prototype.onRender.call(this);

		// update count bubbles
		//
		let people = this.getPeople();
		if (people) {
			this.getChildView('sidebar').showPeopleCounts(people);
		}

		// set up resize callback
		//
		$(window).bind('resize', () => {
			this.onResize();
		});
	},

	getMainBarView: function() {
		return new AffiliatesMapView({
			el: this.$el.find('.mainbar')[0],
			latitude: 43.0740,
			longitude: 89.406,
			zoom_level: 16,
			grid: null,
			map_kind: 'map',
			parent: this,

			// callbacks
			//
			onstart: () => this.onStart()
		});
	},

	getSideBarView: function() {
		return new InfoView({

			// callbacks
			//
			onclick: (filters) => this.onClick(filters)
		});
	},

	getPeople: function() {
		let mainView = this.getChildView('mainbar');
		if (mainView && mainView.people) {
			return mainView.people.models;
		}
	},

	getSelectedInterests: function() {
		return this.getChildView('sidebar').getSelectedInterests();
	},

	getSelectedTools: function() {
		return this.getChildView('sidebar').getSelectedTools();
	},

	//
	// sidebar rendering methods
	//

	showPerson: function(person, options) {
		let mapView = this.getChildView('mainbar');

		// save collection
		//
		this.savedPeople = mapView.people.models;

		// show person in mainbar
		//
		this.getChildView('mainbar').showPerson(person, {
			zoom_to: options? options.zoom_to : true
		});

		// show person in sidebar
		//
		this.showChildView('sidebar', new PersonView({
			model: person,
			editable: options? options.editable : false,
			query: options? options.query : undefined
		}));

		/*
		if (options && options.update_query_string) {
			window.location.search = '?person=' + person.get('id');
		}
		*/
	},

	showPeople: function(people, options) {

		// save collection
		//
		this.savedPeople = this.getPeople();

		// show people in mainbar
		//
		this.getChildView('mainbar').showPeople(people, options);
		this.getChildView('sidebar').showPeopleCounts(people);
	},

	filterByTerms: function(terms) {
		let mapView = this.parent.getChildView('content mainbar');
		mapView.peopleView.filterByTerms(terms);
	},

	clearSideBar: function() {
		this.showChildView('sidebar', this.getSideBarView());
	},

	//
	// event handling methods
	//

	onStart: function() {
		this.getChildView('sidebar').showPeopleCounts(this.getPeople());

		// perform callback
		//
		if (this.options.onstart) {
			this.options.onstart();
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function(options) {
		let mapView = this.parent.getChildView('content mainbar');
		mapView.peopleView.unfilter();
		this.filterByTerms(options.terms);
	},

	//
	// window event handling methods
	//

	onResize: function() {
		if (this.hasChildView('mainbar')) {
			this.getChildView('mainbar').onResize();
		}
	}
});