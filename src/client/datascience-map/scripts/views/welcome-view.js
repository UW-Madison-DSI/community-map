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

import Buildings from '../collections/buildings.js';
import SplitView from '../views/layout/split-view.js';
import InfoView from '../views/info/info-view.js';
import PersonView from '../views/items/people/person-view.js';
import PeopleView from '../views/items/people/people-view.js';
import PlacesView from '../views/items/places/places-view.js';
import AffiliatesMapView from '../views/maps/affiliates-map-view.js';
import Browser from '../utilities/web/browser.js';

export default SplitView.extend({

	//
	// attributes
	//

	orientation: $(window).width() < 640? 'vertical': 'horizontal',
	flipped: false,
	sizes: $(window).width() < 640? [0, 100] : [35, 65],

	//
	// querying methods
	//

	filter: function(terms, appointments) {
		let mapView = this.parent.getChildView('content mainbar');
		mapView.peopleView.filter(terms, appointments);
	},

	//
	// getting methods
	//

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
			onstart: () => this.onStart(),
			onclick: (event) => this.onClick(event)
		});
	},

	getSideBarView: function() {
		return new InfoView({

			// callbacks
			//
			onclick: (filters) => this.onClickCheckbox(filters)
		});
	},

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

	clearSearch: function() {
		this.getChildView('mainbar search').clear();
		this.getChildView('mainbar').resetView();
	},

	//
	// sidebar rendering methods
	//

	showPerson: function(person, options) {
		let mapView = this.getChildView('mainbar');

		// open sidebar if mobile
		//
		if (Browser.device == 'phone' || $(window).width() < 768) {

			// open sidebar
			//
			this.setSideBarSize(100);
		}

		// save collection
		//
		this.savedPeople = mapView.people.models;

		// save view
		//
		mapView.pushView();

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

		// open sidebar if mobile
		//
		if (Browser.device == 'phone' || $(window).width() < 768) {

			// open sidebar
			//
			this.setSideBarSize(0);
		}

		// save collection
		//
		this.savedPeople = this.getPeople();

		// show people in mainbar
		//
		this.getChildView('mainbar').showPeople(people, options);

		// show sidebar
		//
		this.getChildView('sidebar').showPeopleCounts(people);
		/*
		if (options && options.query) {
			this.showSelectedPeople(people, options);
		} else {
			this.getChildView('sidebar').showPeopleCounts(people);
		}
		*/
	},

	showSelectedPeople: function(people, options) {
		this.showChildView('sidebar', new PeopleView(_.extend({
			collection: people
		}, options)));
	},

	showPlace: function(place, options) {
		this.showPlaces([place], options);
	},

	showPlaces: function(places, options) {
		this.showChildView('sidebar', new PlacesView(_.extend({
			collection: new Buildings(places)
		}, options)));
	},

	clearSideBar: function() {
		if (this.hasChildView('sidebar')) {
			this.showChildView('sidebar', this.getSideBarView());
		}
	},

	//
	// event handling methods
	//

	onStart: function() {
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').showPeopleCounts(this.getPeople());
		}

		// perform callback
		//
		if (this.options.onstart) {
			this.options.onstart();
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {
		if (event.originalEvent.target.nodeName == 'image') {

			// clear sidebar if showing places
			//
			if (this.getChildView('sidebar') instanceof PlacesView) {
				this.clearSearch();
			}
		}
	},

	onClickCheckbox: function(options) {
		let mapView = this.parent.getChildView('content mainbar');
		mapView.peopleView.unfilter();
		// this.filterByTerms(options.terms);
		// this.filterByAppointments(options.appointments);
		this.filter(options.terms, options.appointments);
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