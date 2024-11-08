/******************************************************************************\
|                                                                              |
|                                person-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a selectable, unscaled marker element.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import SVGRenderable from '../../../../views/svg/behaviors/svg-renderable.js';
import AffiliationShowable from '../../../../views/maps/overlays/people/behaviors/affiliation-showable.js';
import PersonMarkerView from '../../../../views/maps/overlays/people/person-marker-view.js';

export default BaseView.extend(_.extend({}, SVGRenderable, AffiliationShowable, {

	//
	// attributes
	//

	tagName: 'g',
	className: 'person',
	animated: true,

	//
	// getting methods
	//

	getMarkerView: function() {
		return new PersonMarkerView({
			model: this.model,
			parent: this,

			// callbacks
			//
			onclick: () => {
				this.select();
			}
		});
	},

	//
	// selection methods
	//

	isSelected: function() {
		return this.$el.hasClass('selected');
	},

	select: function(options) {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');
		let mapView = mainView.getChildView('mainbar');

		// show in sidebar
		//
		if (this.isSelected()) {
			mapView.selectPerson(this);
		}

		this.markerView.select();
		this.$el.addClass('selected');

		// zoom to person
		//
		if (options && options.zoom_to) {
			mapView.goTo(this.markerView.getLocation(), 1);
		}
	},

	deselect: function() {
		this.$el.removeClass('selected');
		this.markerView.deselect();
		this.$el.find('.selected').removeClass('selected');

		let viewport = this.getParentViewById('viewport');
		if (viewport) {
			viewport.parent.deselectPerson();
		}
	},

	//
	// rendering methods
	//

	toElement: function() {

		// create element
		//
		let element = document.createElementNS('http://www.w3.org/2000/svg', this.tagName);

		// set class
		//
		if (this.className) {
			$(element).attr('class', this.className);
		}

		return element;
	},

	render: function() {
		this.$el = $(this.toElement());
		this.showMarker();
		this.showAffiliations();

		// tag with affiliation class
		//
		if (this.model.has('affiliation')) {
			let affiliation = this.model.get('affiliation');
			if (affiliation) {
				affiliation = affiliation.replace(/ /g, '-');
				this.$el.addClass(affiliation);
			}
		}

		return this.$el;
	},

	onRender: function() {
		this.show();
	},

	showMarker: function() {
		this.markerView = this.getMarkerView();
		this.$el.append(this.markerView.render());
	},

	toTop: function() {
		let parent = this.$el.parent();
		this.$el.detach();
		parent.append(this.$el);
	},

	//
	// cleanup methods
	//

	clear: function() {
		this.clearCollaborators();
		this.clearActivities();
	},

	onBeforeDestroy: function() {
		this.clear();
		this.markerView.destroy();
	}
}));