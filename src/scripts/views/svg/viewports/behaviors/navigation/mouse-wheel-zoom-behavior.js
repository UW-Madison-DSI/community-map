/******************************************************************************\
|                                                                              |
|                           mouse-wheel-zoom-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import MouseWheelBehavior from '../../../../../views/behaviors/mouse/mouse-wheel-behavior.js';

//
// attributes
//

let defaultZoomFactor = 1.05;

//
// constructor
//

function MouseWheelZoomBehavior(viewport, options) {
	
	// call "superclass" constructor
	//
	MouseWheelBehavior.call(this, options.el || (viewport? viewport.el : null), _.extend(options || {}, {
		
		// callbacks
		//
		onmousewheel: (event) => {

			// zoom based upon direction of wheel movement
			//
			if (event.deltaY > 0) {
				this.onZoom(this.zoomFactor);
			} else {
				this.onZoom(1 / this.zoomFactor);
			}
		}
	}));

	// set attributes
	//
	this.viewport = viewport;
	this.zoomFactor = options.zoomFactor || defaultZoomFactor;
	this.minScale = options.minScale;
	this.maxScale = options.maxScale;

	return this;
}

//
// extend prototype from "superclass"
//

MouseWheelZoomBehavior.prototype = _.extend({}, MouseWheelBehavior.prototype, {

	//
	// event handling methods
	//

	onZoom: function(zoom) {
		let scale = this.viewport.scale * zoom;

		// check bounds on scale
		//
		if (this.minScale && scale < this.minScale) {
			scale = this.minScale;
		}
		if (this.maxScale && scale > this.maxScale) {
			scale = this.maxScale;
		}
		this.viewport.setScale(scale);
	}
});

export default MouseWheelZoomBehavior;