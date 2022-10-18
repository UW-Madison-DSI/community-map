/******************************************************************************\
|                                                                              |
|                             mouse-drag-pan-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Vector2 from '../../../../../utilities/math/vector2.js';
import Units from '../../../../../utilities/math/units.js';
import MouseDragBehavior from '../../../../mouse/mouse-drag-behavior.js';

export default function MouseDragPanBehavior(viewport, options) {

	// set attributes
	//
	this.viewport = viewport;
	
	// call "superclass" constructor
	//
	MouseDragBehavior.call(this, viewport.el, _.extend(options || {}, {
		cursor: 'move'
	}));

	return this;
}

// extend prototype from "superclass"
//
MouseDragPanBehavior.prototype = _.extend(Object.create(MouseDragBehavior.prototype), {

	//
	// event handling methods
	//

	onMouseDown: function(mouseX, mouseY) {

		// call "superclass" method
		//
		MouseDragBehavior.prototype.onMouseDown.call(this, mouseX, mouseY);

		// store viewport offset at start of drag
		//
		this.offsetX = this.viewport.offset.x;
		this.offsetY = this.viewport.offset.y;
	},

	onMouseDrag: function(mouseX, mouseY) {
		let dragX = mouseX - this.startX;
		let dragY = mouseY - this.startY;
		
		// call "superclass" method
		//
		MouseDragBehavior.prototype.onMouseDrag.call(this, dragX, dragY);

		// convert to viewport coords
		//
		if ($(this.viewport.el).is('canvas')) {
			dragX /= Units.pixelsPerMillimeter;
			dragY /= Units.pixelsPerMillimeter;
		}

		// find new viewport offset
		//
		let panX = dragX / this.viewport.scale;
		let panY = dragY / this.viewport.scale;
		let offsetX = this.offsetX + panX;
		let offsetY = this.offsetY + panY;

		// apply new viewport offset
		//
		this.viewport.setOffset(new Vector2(offsetX, offsetY));
	}
});