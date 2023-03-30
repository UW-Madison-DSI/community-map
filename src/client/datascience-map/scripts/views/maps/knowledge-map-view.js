/******************************************************************************\
|                                                                              |
|                            knowledge-map-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a map view showing a campus knowledge map.               |
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
import Activity from '../../models/activities/activity.js';
import People from '../../collections/people.js';

// collections
//
import AcademicPeople from '../../collections/academic/academic-people.js';
import AcademicArticles from '../../collections/academic/activities/academic-articles.js';
import AcademicAwards from '../../collections/academic/activities/academic-awards.js';
import AcademicBookChapters from '../../collections/academic/activities/academic-book-chapters.js';
import AcademicBooks from '../../collections/academic/activities/academic-books.js';
import AcademicConferenceProceedings from '../../collections/academic/activities/academic-conference-proceedings.js';
import AcademicGrants from '../../collections/academic/activities/academic-grants.js';
import AcademicPatents from '../../collections/academic/activities/academic-patents.js';
import AcademicTechnologies from '../../collections/academic/activities/academic-technologies.js';
import GoogleScholarPeople from '../../collections/google-scholar/google-scholar-people.js';

// views
//
import CampusMapView from './campus-map-view.js';

// collection views
//
import PeopleView from '../../views/maps/overlays/people/people-view.js';
import ArticlesView from '../../views/maps/overlays/activities/articles/articles-view.js';
import AwardsView from '../../views/maps/overlays/activities/awards/awards-view.js';
import BookChaptersView from '../../views/maps/overlays/activities/book-chapters/book-chapters-view.js';
import BooksView from '../../views/maps/overlays/activities/books/books-view.js';
import ConferenceProceedingsView from '../../views/maps/overlays/activities/conference-proceedings/conference-proceedings-view.js';
import GrantsView from '../../views/maps/overlays/activities/grants/grants-view.js';
import PatentsView from '../../views/maps/overlays/activities/patents/patents-view.js';
import TechnologiesView from '../../views/maps/overlays/activities/technologies/technologies-view.js';

// ui views
//
import SearchBarView from '../../views/toolbars/search-bar-view.js';
import ActivitiesBarView from '../../views/toolbars/activities-bar-view.js';
import ViewBarView from '../../views/toolbars/view-bar-view.js';
import MapBarView from '../../views/toolbars/map-bar-view.js';
import DateBarView from '../../views/toolbars/date-bar-view.js';

// utilities
//
import QueryString from '../../utilities/web/query-string.js';

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
			<div id="source-selector" class="hidden toolbar">
				<div class="title">Source</div>
				<select data-toggle="tooltip" title="Data Source" data-placement="bottom">
					<option value="academic_analytics">Academic Analytics</option>
					<option value="google_scholar">Google Scholar</option>
				</select>
			</div>
			<div id="activities-bar"></div>
			<div id="activity-bar"></div>
			<div id="view-bar"></div>
			<div id="map-bar"></div>
			<div id="zoom-bar"></div>
			<div id="date-bar"></div>
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
		activities: {
			el: '#activities-bar',
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
		date: {
			el: '#date-bar',
			replaceElement: true
		},
		options: {
			el: '#options-bar',
			replaceElement: true
		},
	},

	/*
	events: {
		'click': 'onClick'
	},
	*/

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

	getPeople: function(source) {
		switch (source) {
			case 'google_scholar':
				return new GoogleScholarPeople();
			default:
				return new AcademicPeople();
		}
	},

	getActivities: function(activity, source) {
		switch (source) {

			case 'academic_analytics':
				switch (activity) {
					case 'articles':
						return new AcademicArticles();
					case 'awards':
						return new AcademicAwards();
					case 'book_chapters':
						return new AcademicBookChapters();
					case 'books':
						return new AcademicBooks();
					case 'conference_proceedings':
						return new AcademicConferenceProceedings();
					case 'grants':
						return new AcademicGrants();
					case 'patents':
						return new AcademicPatents();
					case 'technologies':
						return new AcademicTechnologies();
				}
				break;
		}
	},

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
	// setting methods
	//

	setYear: function(value) {
		let personView = this.getPersonView();
		if (personView) {
			personView.setYear(value);
			this.viewport.rescale();		
		}
	},

	setRange: function(values) {
		let personView = this.getPersonView();
		if (personView) {
			personView.setRange(values);
			this.viewport.rescale();
		}
	},

	setMapMode: function(mapMode) {

		// update map
		//
		CampusMapView.prototype.setMapMode.call(this, mapMode);

		// update maps toolbar
		//
		this.getChildView('map').setMapMode(mapMode);
	},

	//
	// selection methods
	//

	selectPerson: function(personView) {
		this.selected = personView;

		// update sidebar
		//
		this.parent.showPerson(personView.model);

		// update mainbar
		//
		this.hideUnselectedPeople();
	},

	deselectPerson: function() {
		this.selected = null;

		// update mainbar
		//
		this.showUnselectedPeople();
	},

	//
	// rendering methods
	//

	showToolbars: function() {
		if (this.hasRegion('search')) {
			this.showChildView('search', new SearchBarView({
				parent: this
			}));
		}
		if (this.hasRegion('activities')) {
			this.showChildView('activities', new ActivitiesBarView({
				parent: this
			}));
		}
		if (this.hasRegion('view')) {
			this.showChildView('view', new ViewBarView({
				parent: this
			}));
		}
		if (this.hasRegion('map')) {
			this.showChildView('map', new MapBarView({
				parent: this
			}));
		}
		if (this.hasRegion('date')) {
			this.showChildView('date', new DateBarView({
				parent: this,

				// callbacks
				//
				onchange: () => {
					this.updateQueryString();
				}
			}));
		}
	},

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

		// set initial state
		//
		if (this.hasChildView('activities')) {
			this.getChildView('activities').hide();
		}
		if (this.hasChildView('date')) {
			this.getChildView('date').hide();
		}

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
	},

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
			this.getPeople(source).fetchByInstitutionUnit(department, {

				// callbacks
				//
				success: (collection) => {
					let people = collection.models;

					// add affilations
					//
					this.getPeople(source).fetchByInstitutionUnitAffiliation(department, {

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

		// show popover if one place
		//
		/*
		if (places.length == 1) {
			let view = this.buildingsView.findByModel(places[0]);
			window.setTimeout(() => {
				view.showPopover();
			}, 2000);
		}
		*/

		this.zoomToLocations(locations);

		// show places in sidebar
		//
		this.parent.showSideBar();
		this.parent.showPlaces(places);
	},

	getActivitiesView: function(activity, params) {
		switch (activity) {
			case 'articles':
				return new ArticlesView(params);
			case 'awards':
				return new AwardsView(params);
			case 'book_chapters':
				return new BookChaptersView(params);
			case 'books':
				return new BooksView(params);
			case 'conference_proceedings':
				return new ConferenceProceedingsView(params);
			case 'grants':
				return new GrantsView(params);
			case 'patents':
				return new PatentsView(params);
			case 'technologies':
				return new TechnologiesView(params);
		}
	},

	showActivity: function(activity, collection, options) {
		this.activitiesView = this.getActivitiesView(activity, {
			collection: collection,
			parent: this.viewport
		});

		this.viewport.add(this.activitiesView);
		this.current = this.activitiesView;
		this.selected = null;

		let locations = this.activitiesView.getLocations();
		this.zoomToLocations(locations);

		// show activities in sidebar
		//
		this.parent.parent.showSideBar();
		this.parent.parent.showActivities(activity, collection, options);

		// configure UI
		//
		this.showActivitiesBar();
		this.showDateBar();

		return this.activitiesView;
	},

	//
	// updating methods
	//

	updateQueryString: function() {
		if (this.hasChildView('search')) {
			this.getChildView('search').updateQueryString();
		}
	},

	//
	// hiding methods
	//

	showSearchBar: function() {
		this.getChildView('search').show();
	},

	hideSearchBar: function() {
		this.getChildView('search').hide();
	},

	showActivitiesBar: function(options) {
		if (this.hasChildView('activities')) {
			this.getChildView('activities').show(options);
		}
	},

	hideActivitiesBar: function() {
		if (this.hasChildView('activities')) {
			this.getChildView('activities').hide();
		}
	},

	showDateBar() {
		this.$el.find('#footer').hide();
		this.getChildView('date').show();
	},

	hideDateBar() {
		this.getChildView('date').hide();
		this.$el.find('#footer').show();
	},

	hidePopovers: function() {
		$('.popover').remove();
	},

	//
	// navigation methods
	//

	zoomToPerson: function(personView) {

		// zoom to person
		//
		let collaboratorViews = personView.getCollaboratorViews();
		if (collaboratorViews) {
			if (collaboratorViews.length > 1) {
				let locations = this.people.getPeopleLocations(collaboratorViews);
				locations.push(personView.markerView.location);
				this.zoomToLocations(locations);
			} else {
				this.panTo(personView.markerView.location);
			}
		} else {
			this.panTo(personView.markerView.location);
		}
	},

	zoomToPeople: function() {
		let locations = [];
		for (let i = 0; i < this.peopleView.children.length; i++) {
			let personView = this.peopleView.children.findByIndex(i);
			locations.push(personView.markerView.getLocation());
		}
		this.zoomToLocations(locations);
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

	clearActivities() {
		if (this.activitiesView) {
			this.activitiesView.destroy();
			this.activitiesView = null;
		}
		this.hideActivitiesBar();
	},

	clearCollaborators: function() {
		this.viewport.$el.find('.collaborators').remove();
	},

	clearPopovers: function() {
		$('.popover').remove();
	},

	reset: function() {

		// reset UI elements to their initial state
		//
		this.hideDateBar();
		this.hideActivitiesBar();
	},

	clear: function() {
		this.clearPeople();
		this.clearActivities();
		this.clearCollaborators();
		this.clearPopovers();
		this.deselectAll();
		this.showMarkerLabels();
		this.reset();
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
	// selection methods
	//

	deselectAll: function() {
		this.deselectPeople();
		this.deselectBuildings();

		// this.$el.find('.selected').removeClass('selected');
		// this.parent.clearSideBar();
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
	// selection hiding methods
	//

	showUnselectedPeople: function() {
		this.viewport.$el.removeClass('hide-unselected-people');
	},

	hideUnselectedPeople: function() {
		this.viewport.$el.addClass('hide-unselected-people');
	},

	showUnselectedActivity: function(activity) {
		this.viewport.$el.removeClass('hide-unselected-' + activity);
	},

	hideUnselectedActivity: function(activity) {
		this.viewport.$el.addClass('hide-unselected-' + activity);
	},

	showUnselectedItems: function() {
		this.showUnselected();
		for (let i = 0; i < Activity.kinds.length; i++) {
			this.showUnselectedActivity(Activity.kinds[i]);
		}
	},

	hideUnselectedItems: function() {
		this.hideUnselected();
		for (let i = 0; i < Activity.kinds.length; i++) {
			this.hideUnselectedActivity(Activity.kinds[i]);
		}
	},

	//
	// navigation event handling methods
	//

	onZoomStart: function() {

		// call superclass method
		//
		CampusMapView.prototype.onZoomStart.call(this);

		// update markers
		//
		this.updateViewportMarkerLabels();
	},

	onZoomEnd: function() {

		// call superclass method
		//
		CampusMapView.prototype.onZoomEnd.call(this);

		// update markers
		//
		this.showViewportMarkerLabels();
	},

	onDrag: function() {

		// call superclass method
		//
		CampusMapView.prototype.onDrag.call(this);

		// update markers
		//
		this.updateViewportMarkerLabels();
	},

	onDragEnd: function(dragx, dragy) {

		// call superclass method
		//
		CampusMapView.prototype.onDragEnd.call(this, dragx, dragy);

		// update markers
		//
		this.showViewportMarkerLabels();
	},

	onWheelZoomStart: function() {

		// call superclass method
		//
		CampusMapView.prototype.onWheelZoomStart.call(this);

		// update markers
		//
		this.updateViewportMarkerLabels();
	},

	onWheelZoomEnd: function() {

		// call superclass method
		//
		CampusMapView.prototype.onWheelZoomEnd.call(this);

		// update markers
		//
		this.showViewportMarkerLabels();
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {
		/*
		if (event.target.nodeName == 'image') {
			this.deselectAll();
		}
		*/

		if (this.hasChildView('search')) {
			this.getChildView('search').$el.find('input').blur();
		}

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(event);
		}
	},

	onClickLabel: function(labelView) {
		this.getChildView('search').searchFor(labelView.options.fullname, {
			category: 'people'
		});
	}
}, {

	//
	// cache clearing method
	//

	reset: function() {
		directory = [];
	}
});