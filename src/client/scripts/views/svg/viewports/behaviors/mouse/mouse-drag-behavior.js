/******************************************************************************\
|                                                                              |
|                            mouse-drag-behavior.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import MouseDragBehavior from '../../../../../views/behaviors/mouse/mouse-drag-behavior.js';

//
// constructor
//

function MouseDragViewportBehavior(viewport, options) {
	
	// call "superclass" constructor
	//
	MouseDragBehavior.call(this, viewport.el, options);

	// set attributes
	//
	this.viewport = viewport;

	return this;
}

//
// extend prototype from "superclass"
//

MouseDragViewportBehavior.prototype = _.extend({}, MouseDragBehavior.prototype, {

	//
	// event handling methods
	//

	onMouseDown: function(event) {

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseDown.call(this, event);

		// update viewport
		//
		if (this.viewport.onStartDrag) {
			this.viewport.onStartDrag(event, this);
		}
	},

	onMouseDrag: function(event) {

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseDrag.call(this, event);

		// update viewport
		//
		if (this.viewport.onDrag) {
			this.viewport.onDrag(event, this);
		}
	},

	onMouseUp: function(event) {

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseUp.call(this, event);

		// update viewport
		//
		if (this.drag && this.viewport.onEndDrag) {
			this.viewport.onEndDrag(event, this);
		}
	}
});

export default MouseDragViewportBehavior;