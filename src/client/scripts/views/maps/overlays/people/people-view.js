/******************************************************************************\
|                                                                              |
|                                people-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a collection of people.                        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import CollectionView from '../../../collections/collection-view.js';
import SVGCollectionRenderable from '../../../../views/svg/behaviors/svg-collection-renderable.js';
import PersonView from '../../../../views/maps/overlays/people/person-view.js';

export default CollectionView.extend(_.extend({}, SVGCollectionRenderable, {

	//
	// attributes
	//

	tagName: 'g',
	className: 'people',
	childView: PersonView,

	//
	// getting methods
	//

	getLocations() {
		let locations = [];
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			if (child.markerView.isVisible()) {
				let location = child.markerView.getLocation();
				if (location) {
					locations.push(location);
				}
			}
		}
		return locations;
	},

	getByModelId: function(id) {
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			if (child.markerView.model.get('id') == id) {
				return child;
			}
		}
	},

	//
	// selection methods
	//

	selectAll: function() {
		this.each((child) => {
			child.select();
		});
	},

	deselectAll: function() {
		this.each((child) => {
			child.deselect();
		});
		this.$el.removeClass('hide-unselected');
	},

	clearAll: function() {
		this.each((child) => {
			child.clear();
		});	
	},

	//
	// filtering methods
	//

	filter: function(terms, appointments, affiliates) {
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if ((childView.model.hasTerms(terms) !== false) && 
				(childView.model.hasAppointments(appointments) !== false) && 
				(affiliates? childView.model.get('is_affiliate') : true)) {
				childView.$el.show();
			} else {
				childView.$el.hide();
			}
		}
	},

	filterByTerms: function(terms) {
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if ((childView.model.hasTerms(terms) !== false)) {
				childView.$el.show();
			} else {
				childView.$el.hide();
			}
		}
	},

	filterByAppointments: function(appointments) {
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if ((childView.model.hasAppointments(appointments) !== false)) {
				childView.$el.show();
			} else {
				childView.$el.hide();
			}
		}
	},

	filterByAffiliates: function(affiliates) {
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if (affiliates? childView.model.get('is_affiliate') : true) {
				childView.$el.show();
			} else {
				childView.$el.hide();
			}
		}
	},

	unfilter: function() {
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			childView.$el.show();
		}
	},

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return {
			model: model,
			parent: this
		}
	},

	//
	// hiding methods
	//

	showUnselected: function() {
		this.viewport.$el.removeClass('selected-people-only');
	},

	hideUnselected: function() {
		this.viewport.$el.addClass('selected-people-only');
	}
}));