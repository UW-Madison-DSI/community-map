/******************************************************************************\
|                                                                              |
|                            person-marker-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a selectable, unscaled marker element.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Vector2 from '../../../../utilities/math/vector2.js';
import LabeledMarkerView from '../../../../views/maps/overlays/markers/labeled-marker-view.js';

//
// local attributes
//

let directory = [];

export default LabeledMarkerView.extend({

	//
	// attributes
	//

	className: 'unscaled person marker',
	d: "M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z",
	offset: new Vector2(-12, -12),
	radius: 20,
	deselectable: false,

	//
	// popover attributes
	//

	popover_title: 
		`<a href="<%= url %>" target="blank">
			<% if (first_name) { %><span class="first-name"><%= first_name %></span><% } %>
			<% if (middle_name) { %><span class="middle-name"><%= middle_name %></span><% } %>
			<% if (last_name) { %><span class="last-name"><%= last_name %></span><% } %>
		</a>`,

	popover_template:
		`<div class="person">
			<% if (profile_photo_url) { %>
			<img class="profile-photo icon" src="<%= profile_photo_url %>" />
			<% } %>
			<div class="info">

				<% if (title) { %>
				<div class="professional-title">
					<label>Title</label>
					<%= title %>
				</div>
				<% } %>

				<% if (primary_affiliation) { %>
				<div class="primary-affiliation">
					<label>Primary Affiliation</label>
					<%= primary_affiliation %>
				</div>
				<% } %>

				<% if (affiliations && affiliations.length > 0) { %>
				<div class="affiliations">
					<label>Other Affiliations</label>
					<%= affiliations.join(', ') %>
				</div>
				<% } %>

				<% if (interests && interests.length > 0) { %>
				<div class="interests">
					<label>Interests</label>
					<%= interests.join(', ') %>
				</div>
				<% } %>

				<% if (research_summary) { %>
				<div class="summary">
					<label>Research Summary</label>
					<%= research_summary %>
				</div>
				<% } %>
			</div>
		</div>`,

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		LabeledMarkerView.prototype.initialize.call(this, options);

		// set attributes
		//
		this.label = this.model.getName();
		this.location = this.getLocation();
		this.tooltip_title = this.model.get('primary_affiliation');
	},

	//
	// getting methods
	//

	getIcon: function() {
		if (this.model.hasProfilePhoto()) {
			let width = 38;
			let height = 38;

			// get svg from document
			//
			let icon = document.createElementNS('http://www.w3.org/2000/svg', 'image');

			// set attributes
			//
			$(icon).attr({
				'class': 'icon',
				'href': this.model.getProfileThumbUrl(),
				'width': width,
				'height': height,
				'transform': 'translate(' + (-width / 2) + ', ' + (-height / 2) + ')',
				'clip-path': 'inset(0% round ' + (width / 2) + 'px)'
			});

			return icon;
		} else {
			return LabeledMarkerView.prototype.getIcon.call(this);
		}
	},

	getPopoverIcon: function() {
		return this.model.get('title') == 'Professor'? '<i class="fa fa-user-graduate"></i>' : '<i class="fa fa-user"></i>';
	},

	getRandom: function(minRadius, maxRadius) {
		let vector = Vector2.srandom(maxRadius, maxRadius);
		let length = vector.length();
		while (length < minRadius || length > maxRadius) {
			vector = Vector2.srandom(maxRadius, maxRadius);
			length = vector.length();		
		}
		return vector;
	},

	getLocation() {
		let viewport = this.getParentViewById('viewport');
		if (viewport) {
			return this.constructor.getLocationOf(this.model, viewport.parent);
		}
	},

	getBuildingLocation(mapView) {
		if (this.model.has('building_number')) {
			let buildingNumber = this.model.get('building_number');
			return mapView.getBuildingLocation(buildingNumber);
		} else {
			let affiliation = this.model.getAffiliationBaseName();
			return mapView.labelsView.getLocationOf([affiliation]);
		}
	},

	//
	// rendering methods
	//

	showPerson: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');
		let mapView = mainView.getChildView('mainbar');

		if (mapView.selected == this.options.parent) {
			return;
		}

		if (mapView.peopleView && mapView.peopleView.collection.contains(this.model)) {
			topView.showPerson(this.model, {
				update_query_string: true
			});
			mapView.hideUnselectedPeople();
			mapView.selected = this.options.parent;
		} else {
			let viewport = this.getParentViewById('viewport');
			if (viewport) {

				// search for person
				//
				viewport.parent.getChildView('search').searchFor(this.model.getName(), {
					category: 'people',
					exact: true
				});
			}
		}
	},

	updateLabel: function() {
		this.label = this.model.getName();
		this.$el.find('text').html(this.label);
	},

	//
	// animation methods
	//

	bounce: function() {

		// add style
		//
		this.$el.find('circle').addClass('bouncing');

		// wait for duration
		//
		window.setTimeout(() => {

			// remove style
			//
			this.$el.find('circle').removeClass('bouncing');
		}, 300);
	},

	//
	// mouse event handling methods
	//

	onMouseOver: function() {
		this.showPopover();
	},

	onMouseLeave: function() {
		this.hidePopover();
	},

	onSelect: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');
		let mapView = mainView.getChildView('mainbar');
		let queryBarView = mapView.getChildView('search');

		// call superclass method
		//
		LabeledMarkerView.prototype.onSelect.call(this, event);

		// select item
		//
		this.options.parent.select();

		// show person in sidebar
		//
		mainView.showPerson(this.model, {
			query: queryBarView? queryBarView.getValue() : undefined,
			zoom_to: true
		});
	}
}, {

	//
	// cache clearing method
	//

	reset: function() {
		directory = [];
	},

	//
	// static methods
	//

	getLocationOf(person, mapView) {
		let id = person.get('id');

		// check if person is in directory
		//
		if (directory[id]) {

			// return directory person
			//
			return directory[id];
		} else {
			let location;

			// find person's location
			//
			if (person.has('building_number')) {
				let buildingNumber = person.get('building_number');
				location = mapView.getBuildingLocation(buildingNumber);
			} else {
				let affiliation = person.getAffiliationBaseName();
				let affiliations = affiliation? [ affiliation ] : undefined;
				location = mapView.getLocationOf(affiliations);
			}

			// add randomness to avoid pileups
			//
			if (location) {
				location.add(Vector2.srandom(25, 25));
			}

			// store location in directory
			//
			directory[id] = location;

			return location;
		}
	},
});