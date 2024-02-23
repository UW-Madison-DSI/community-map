/******************************************************************************\
|                                                                              |
|                            mouse-drag-zoom-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import MouseDragBehavior from '../../../../../views/svg/viewports/behaviors/mouse/mouse-drag-behavior.js';

//
// attributes
//
let defaultZoomFactor = 5;

//
// constructor
//

function MouseDragZoomBehavior(viewport, options) {

	// call "superclass" constructor
	//
	MouseDragBehavior.call(this, viewport, options);

	// set attributes
	//
	this.zoomFactor = options.zoomFactor || defaultZoomFactor;
	this.minScale = options.minScale;
	this.maxScale = options.maxScale;

	// set optional attributes 
	//
	if (options.mode) {
		this.mode = this.options.mode;
	}

	return this;
}

//
// extend prototype from "superclass"
//

MouseDragZoomBehavior.prototype = _.extend({}, MouseDragBehavior.prototype, {

	//
	// attributes
	//

	cursor: 'ns-resize',

	//
	// event handling methods
	//

	onMouseDown: function(event) {

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseDown.call(this, event);

		// reset drag
		//
		this.drag = this.getOffset(this.start, this.current);
		this.sign = Math.sign(this.drag.top) || 1;

		// perform callback
		//
		if (this.options.onzoomstart) {
			this.options.onzoomstart();
		}
	},

	onMouseDrag: function(event) {

		// find change in drag
		//
		let drag = this.getOffset(this.start, this.current);
		let delta = (this.drag.top - drag.top) * this.sign;

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseDrag.call(this, event);

		// compute zoom and new scale
		//
		let zoom = 1 - (delta / this.viewport.height) * MouseDragZoomBehavior.zoomFactor;
		let scale = this.viewport.scale * zoom;

		// check bounds on scale
		//
		if (scale < this.minScale) {
			scale = this.minScale;
		} else if (scale > this.maxScale) {
			scale = this.maxScale;
		}

		// set scale
		//
		this.viewport.setScale(scale);

		// save drag
		//
		this.drag = drag;
	},

	onMouseUp: function(event) {

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseUp.call(this, event);

		// reset drag
		//
		this.drag = undefined;

		// perform callback
		//
		if (this.options.onzoomend) {
			this.options.onzoomend();
		}
	}
});

//
// static attributes
//

_.extend(MouseDragZoomBehavior, {
	zoomFactor: 5
});

export default MouseDragZoomBehavior;