/******************************************************************************\
|                                                                              |
|                             mouse-drag-pan-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import MouseDragBehavior from '../../../../../views/svg/viewports/behaviors/mouse/mouse-drag-behavior.js';
import Vector2 from '../../../../../utilities/math/vector2.js';

//
// constructor
//

function MouseDragPanBehavior(viewport, options) {
	
	// call "superclass" constructor
	//
	MouseDragBehavior.call(this, viewport, options);

	return this;
}

//
// extend prototype from "superclass"
//

MouseDragPanBehavior.prototype = _.extend({}, MouseDragBehavior.prototype, {

	//
	// attributes
	//

	cursor: 'move',

	//
	// event handling methods
	//

	onMouseDown: function(event) {

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseDown.call(this, event);

		// store viewport offset at start of drag
		//
		this.offset = this.viewport.offset || {
			x: 0,
			y: 0
		};

		// perform callback
		//
		if (this.options.ondragstart) {
			this.options.ondragstart(this.offset.x, this.offset.y);
		}
	},

	onMouseDrag: function(event) {

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseDrag.call(this, event);

		// find viewport offset
		//
		let offset = {
			x: this.offset.x + this.drag.left / this.viewport.scale,
			y: this.offset.y + this.drag.top / this.viewport.scale
		};

		// apply viewport offset
		//
		this.viewport.setOffset(new Vector2(offset.x, offset.y));

		// perform callback
		//
		if (this.options.ondrag) {
			this.options.ondrag(this.offset.x, this.offset.y);
		}
	},

	onMouseUp: function(event) {

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseUp.call(this, event);

		// perform callback
		//
		if (this.options.ondragend) {
			this.options.ondragend(this.offset.x, this.offset.y);
		}
	},
});

export default MouseDragPanBehavior;