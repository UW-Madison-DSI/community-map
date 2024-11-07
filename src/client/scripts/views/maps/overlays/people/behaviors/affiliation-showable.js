/******************************************************************************\
|                                                                              |
|                           affiliation-showable.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for showing affiliations.                     |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Vector2 from '../../../../../utilities/math/vector2.js';
import LineView from '../../../../../views/maps/overlays/shapes/line-view.js';

export default {

	//
	// getting methods
	//

	getAffiliationViews: function() {
		let affiliationViews = [];
		let viewport = this.getParentViewById('viewport');

		if (viewport) {
			let mapView = viewport.parent;

			// add line from building to marker
			//
			let markerLocation = this.markerView.getLocation();
			let buildingLocation = this.markerView.getBuildingLocation(mapView);

			// add line view
			//
			if (buildingLocation) {
				affiliationViews.push(new LineView({
					vertex1: new Vector2(markerLocation.x, -markerLocation.y),
					vertex2: new Vector2(buildingLocation.x, -buildingLocation.y),
				}));
			}

			/*
			if (this.model.has('building_number')) {

				// add line from building to marker
				//
				let buildingNumber = this.model.get('building_number');
				let mapView = viewport.parent;
				let markerLocation = this.markerView.getLocation();
				let buildingLocation = mapView.getBuildingLocation(buildingNumber);

				// add line view
				//
				affiliationViews.push(new LineView({
					vertex1: new Vector2(markerLocation.x, -markerLocation.y),
					vertex2: new Vector2(buildingLocation.x, -buildingLocation.y),
				}));
			} else {
				let labels = viewport.parent.labelsView.getLabels([this.model.getAffiliation()]);
				if (labels) {

					// add lines from affiliations to marker
					//
					for (let i = 0; i < labels.length; i++) {
						let label = labels[i];
						let markerLocation = this.markerView.getLocation();
						let labelLocation = label.location;

						// add line view
						//
						affiliationViews.push(new LineView({
							vertex1: new Vector2(markerLocation.x, -markerLocation.y),
							vertex2: new Vector2(labelLocation.x, -labelLocation.y),
							label: label
						}));
					}
				}
			}
			*/
		}

		return affiliationViews;
	},

	//
	// label rendering methods
	//

	showAffiliations: function() {
		let viewport = this.getParentViewById('viewport');
		if (viewport) {
			viewport.$el.removeClass('hide-affiliations');
			let affiliationViews = this.getAffiliationViews();
			this.affiliations = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			$(this.affiliations).addClass('affiliations');
			for (let i = 0; i < affiliationViews.length; i++) {
				let affiliationView = affiliationViews[i];
				$(this.affiliations).append(affiliationView.render());
			}
			this.$el.prepend(this.affiliations);
		}
	},

	hideAffiliations: function() {
		let viewport = this.getParentViewById('viewport');
		if (viewport) {
			viewport.$el.addClass('hide-affiliations');
		}
	},

	unhideAffiliations: function() {
		let viewport = this.getParentViewById('viewport');
		if (viewport) {
			viewport.$el.removeClass('hide-affiliations');
		}
	},

	clearAffiliations: function() {
		let viewport = this.getParentViewById('viewport');
		if (viewport) {
			viewport.$el.removeClass('hide-affiliations');
			viewport.parent.labels.deselect(this.model.getAffiliations());
			if (this.affiliations) {
				this.affiliations.remove();
			}
		}
	}
}