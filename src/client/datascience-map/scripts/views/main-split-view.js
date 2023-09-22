/******************************************************************************\
|                                                                              |
|                              main-split-view.js                              |
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
import SideBarView from '../views/sidebar/sidebar-view.js';
import PersonView from '../views/sidebar/people/person-view.js';
import PlacesView from '../views/sidebar/places/places-view.js';
import PeopleMapView from '../views/maps/people-map-view.js';
import Browser from '../utilities/web/browser.js';
import AddressBar from '../utilities/web/address-bar.js';

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

	filter: function(terms, appointments, affiliates) {
		let mapView = this.parent.getChildView('content mainbar');
		if (mapView.peopleView) {
			mapView.peopleView.filter(terms, appointments, affiliates);
		}
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
		return new PeopleMapView({
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
		return new SideBarView({

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
		if (this.hasChildView('sidebar')) {
			let people = this.getPeople();
			if (people) {
				this.getChildView('sidebar').showPeopleCounts(people);
			}
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

		// hide search bar
		//
		if (mapView) {
			mapView.setToolbarVisible('search', false);
		}

		// set url
		//
		AddressBar.set(location.origin + location.pathname + '#users/' + person.get('id'));

		// open sidebar if mobile
		//
		if (Browser.device == 'phone' || $(window).width() < 768) {

			// open sidebar
			//
			this.setSideBarSize(100);
		}

		// save collection
		//
		if (mapView && mapView.people) {
			this.savedPeople = mapView.people.models;

			// save view
			//
			mapView.pushView();
		}

		// show person in mainbar
		//
		if (this.hasChildView('mainbar') && person) {
			this.getChildView('mainbar').showPerson(person, {
				zoom_to: options? options.zoom_to : true
			});
		}

		// show person in sidebar
		//
		if (this.hasChildView('sidebar') && person) {
			this.showChildView('sidebar', new PersonView({
				model: person,
				editable: options? options.editable : false,
				query: options? options.query : undefined
			}));
		}
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

		// show affiliates only
		//
		/*
		if (QueryString.hasParam('affiliates') && QueryString.getParam('affiliates')) {
			this.filter(null, null, true);
		}
		*/

		// show people counts
		//
		if (this.hasChildView('sidebar') && this.getChildView('sidebar').showPeopleCounts) {
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
		if (event.target.nodeName == 'image') {

			// clear sidebar if showing places
			//
			if (this.getChildView('sidebar') instanceof PlacesView) {
				this.clearSearch();
			}
		}
	},

	onClickCheckbox: function(options) {
		let mapView = this.parent.getChildView('content mainbar');
		if (mapView.peopleView) {
			mapView.peopleView.unfilter();
		}

		// filter people
		//
		this.filter(options.terms, options.appointments, options.affiliates);
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