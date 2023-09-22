/******************************************************************************\
|                                                                              |
|                              people-map-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a map view showing people on campus.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Vector2 from '../../utilities/math/vector2.js';
import Bounds2 from '../../utilities/bounds/bounds2.js';
import People from '../../collections/people.js';
import CampusMapView from '../../views/maps/campus-map-view.js';
import PeopleView from '../../views/maps/overlays/people/people-view.js';
import QueryString from '../../utilities/web/query-string.js';

// toolbar views
//
import SearchBarView from '../../views/toolbars/search-bar-view.js';
import ViewBarView from '../../views/toolbars/view-bar-view.js';
import MapBarView from '../../views/toolbars/map-bar-view.js';
import OptionsBarView from '../../views/toolbars/options-bar-view.js';

//
// local variables
//

let directory = [];

export default CampusMapView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div id="background"></div>

		<svg id="viewport">
			<defs>
				<filter id="outlined" color-interpolation-filters="sRGB">
					<feMorphology in="SourceAlpha" result="MORPH" operator="dilate" radius="1" />
					<feColorMatrix in="MORPH" result="WHITENED" type="matrix" values="-1 0 0 0 1, 0 -1 0 0 1, 0 0 -1 0 1, 0 0 0 1 0"/>
					<feMerge>
						<feMergeNode in="WHITENED"/>
						<feMergeNode in="SourceGraphic"/>
					</feMerge>
				</filter>
				<filter id="selected-text" x="-.025" y="0.15" width="1.05" height="0.75">
					<feFlood flood-color="black"/>
					<feComposite in="SourceGraphic"/>
				</filter>
			</defs>
			<g id="tiles"></g>
			<g id="departments" style="display:none"></g>
		</svg>

		<div id="user-interface" class="full-screen overlay">
			<div id="search-bar"></div>
			<div id="view-bar"></div>
			<div id="map-bar"></div>
			<div id="zoom-bar"></div>
			<div id="options-bar"></div>
		</div>

		<div id="footer" class="fineprint">
			<a href="https://datascience.wisc.edu" target="_blank">
				Data Science Institute, University of Wisconsin-Madison
			</a>
		</div>
	`),

	regions: {
		search: {
			el: '#search-bar',
			replaceElement: true
		},
		view: {
			el: '#view-bar',
			replaceElement: true
		},
		settings: {
			el: '#settings-bar',
			replaceElement: true
		},
		map: {
			el: '#map-bar',
			replaceElement: true
		},
		zoom: {
			el: '#zoom-bar',
			replaceElement: true
		},
		options: {
			el: '#options-bar',
			replaceElement: true
		},
	},

	//
	// methods
	//

	initPeople: function() {
		this.people = new People();
		this.peopleView = new PeopleView({
			collection: this.people
		});
		this.viewport.el.append(this.peopleView.render());
	},

	start: function() {

		// init ui elements
		//
		this.initPeople();
		this.showToolbars();

		// show initial search
		//
		if (this.hasChildView('search')) {
			this.getChildView('search').parseQueryString();
		}

		// perform callback
		//
		if (this.options.onstart) {
			this.options.onstart();
		}

		// show all if no search
		//
		if (!QueryString.hasParam('query') && window.location.hash != '#home') {
			this.showAll();
		}
	},

	maxMarkerLabels: 250,

	//
	// querying methods
	//

	numMarkerLabels: function() {
		return this.viewport.$el.find('.marker text').length;
	},

	//
	// getting methods
	//

	getLocationOf: function(interests) {
		let location = this.labelsView.getLocationOf(interests);

		if (!location) {
			location = Vector2.srandom(300, 200);
		}

		return location;
	},

	getVerticesZoomLevel: function(vertices) {
		if (vertices.length > 1) {
			let bounds2 = new Bounds2();
			for (let i = 0; i < vertices.length; i++) {
				bounds2.extendTo(vertices[i]);
			}
			let size = bounds2.size();
			let dimension = Math.max(size.x, size.y);
			if (dimension != 0) {
				let height = this.viewport.$el.height();
				let size = dimension / height;
				return Math.log2(1 / size) - 1;
			}
		}
	},

	getZoomLevel: function() {
		return this.getChildView('zoom').scaleToZoomLevel(this.viewport.scale);
	},

	getActivityLocation: function(activityView) {
		let location = new Vector2(0, 0);
		let personView = activityView.getParentView('person');
		// return this.getLocationOf(activity.model.getLabels());

		// center on activity's person
		//
		if (personView) {
			location = personView.markerView.location;
		}

		// add randomness
		//
		location = location.plus(Vector2.srandom(300, 200));

		return location;
	},

	getPersonView: function() {
		if (this.peopleView && this.peopleView.children.length == 1) {
			return this.peopleView.children.findByIndex(0);
		} else {
			return this.selected || this.current;
		}
	},

	//
	// selection methods
	//

	deselectAll: function() {
		this.deselectPeople();
		this.deselectBuildings();
	},

	deselectPeople: function() {
		this.selected = null;

		if (this.peopleView) {
			this.peopleView.deselectAll();
		}
	},

	deselectBuildings: function() {
		if (this.buildingsView) {
			this.buildingsView.deselectAll();
		}
	},

	deselectMarkers: function() {
		this.$el.find('.marker.selected').removeClass('selected');
	},

	//
	// hiding methods
	//

	showMarkerLabels: function() {
		this.$el.removeClass('hide-marker-labels');
	},

	hideMarkerLabels: function() {
		this.$el.addClass('hide-marker-labels');
	},

	showViewportMarkerLabels: function() {
		this.viewport.$el.removeClass('hide-marker-labels');
	},

	hideViewportMarkerLabels: function() {
		this.viewport.$el.addClass('hide-marker-labels');
	},

	updateViewportMarkerLabels: function() {
		if (this.autohideLabels || this.numMarkerLabels() > this.maxMarkerLabels) {
			this.hideViewportMarkerLabels();
		}
	},

	//
	// selection hiding methods
	//

	showUnselectedPeople: function() {
		this.viewport.$el.removeClass('hide-unselected-people');
	},

	hideUnselectedPeople: function() {
		this.viewport.$el.addClass('hide-unselected-people');
	},

	//
	// rendering methods
	//

	showPerson: function(person, options) {

		// show people on map
		//
		if (!this.people) {
			this.initPeople();
		}
		this.people.reset([person]);
		if (this.peopleView) {
			this.peopleView.$el.remove();
		}
		this.peopleView = new PeopleView({
			collection: this.people,
			parent: this.viewport
		});
		this.viewport.el.append(this.peopleView.render());

		// fit people to view
		//
		if (options && options.zoom_to) {
			this.zoomToLocations(this.peopleView.getLocations());
		}
	},

	showPeople: function(people, options) {

		// show people on map
		//
		if (!this.people) {
			this.initPeople();
		}
		this.people.reset(people);
		if (this.peopleView) {
			this.peopleView.$el.remove();
		}
		this.peopleView = new PeopleView({
			collection: this.people,
			parent: this.viewport
		});
		this.viewport.el.append(this.peopleView.render());
		this.showUnselectedPeople();

		// fit people to view
		//
		if (options && options.zoom_to) {
			if (this.people.length > 0) {
				this.zoomToLocations(this.peopleView.getLocations());
			}
		}

		// apply affiliates filter
		//
		if (QueryString.hasParam('affiliates') && QueryString.getParam('affiliates')) {
			this.peopleView.filter(null, null, true);
		}

		// perform callback
		//
		if (options && options.success) {
			options.success();
		}
	},

	showDepartmentPeople: function(source, department, options) {
		if (!directory[department]) {
			new People().fetchByInstitutionUnit(department, {
				data: {
					community: defaults.community
				},

				// callbacks
				//
				success: (collection) => {
					let people = collection.models;

					// add affilations
					//
					new People().fetchByInstitutionUnitAffiliation(department, {
						data: {
							community: defaults.community
						},

						// callbacks
						//
						success: (collection) => {
							people = people.concat(collection.models);
							directory[department] = people;

							// show results
							//
							this.showPeople(people, options);
						}
					});
				}
			});
		} else {
			let people = directory[department];

			// show results
			//
			this.showPeople(people, options);
		}
	},

	showPlaces(places) {
		this.buildingsView.deselectAll();
		this.buildingsView.select(places);
		let locations = this.buildingsView.getLocationsOf(places, this);

		this.zoomToLocations(locations);

		// show places in sidebar
		//
		this.parent.showSideBar();
		this.parent.showPlaces(places);
	},

	showAll: function() {
		let department = this.departments.findByName('Data Science');
		if (!this.parent.options.person) {
			this.showDepartmentPeople('academic_analytics', department, {

				// callbacks
				//
				success: () => {
					if (this.options.onstart) {
						this.options.onstart();
					}
				}
			});
		} else {
			if (this.options.onstart) {
				this.options.onstart();
			}		
		}
	},

	//
	// clearing methods
	//

	clearPeople: function() {
		this.people.reset();
		this.showUnselectedPeople();

		if (this.peopleView) {
			this.peopleView.$el.remove();
			this.peopleView = null;
		}

		this.parent.clearSideBar();
	},

	clearPopovers: function() {
		$('.popover').remove();
	},

	clear: function() {
		this.clearPeople();
		this.clearPopovers();
		this.deselectAll();
		this.showMarkerLabels();
	},

	//
	// toolbar rendering methods
	//

	showToolbars: function() {
		let toolbars = Object.keys(this.regions);
		for (let i = 0; i < toolbars.length; i++) {
			this.showToolbar(toolbars[i]);
		}
	},

	showToolbar: function(kind) {
		switch (kind) {
			case 'search':
				this.showChildView('search', new SearchBarView({
					parent: this
				}));
				break;
			case 'view':
				this.showChildView('view', new ViewBarView({
					parent: this
				}));
				break;
			case 'options':
				this.showChildView('options', new OptionsBarView({
					parent: this
				}));
				break;
			case 'map':
				this.showChildView('map', new MapBarView({
					parent: this
				}));
				break;
			case 'zoom':
				this.showZoomBar();
				break;
		}
	},

	//
	// selection hiding methods
	//

	showUnselectedPeople: function() {
		this.viewport.$el.removeClass('hide-unselected-people');
	},

	hideUnselectedPeople: function() {
		this.viewport.$el.addClass('hide-unselected-people');
	}
}, {

	//
	// cache clearing method
	//

	reset: function() {
		directory = [];
	}
});