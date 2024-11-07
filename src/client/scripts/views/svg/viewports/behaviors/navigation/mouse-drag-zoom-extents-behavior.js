/******************************************************************************\
|                                                                              |
|                       mouse-drag-zoom-extents-behavior.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import MouseDragRectBehavior from '../../../../../views/svg/viewports/behaviors/manipulation/mouse-drag-rect-behavior.js';

//
// constructor
//

function MouseDragZoomExtentsBehavior(viewport, options) {

	// call "superclass" constructor
	//
	MouseDragRectBehavior.call(this, viewport, options);

	return this;
}

//
// extend prototype from "superclass"
//

MouseDragZoomExtentsBehavior.prototype = _.extend({}, MouseDragRectBehavior.prototype, {

	//
	// attributes
	//

	cursor: 'nwse-resize',

	//
	// event handling methods
	//

	onMouseUp: function(event) {

		// end drag
		//
		if (this.view) {
			let rectSize = this.view.model.getDiagonal().length();
			let viewportSize = this.viewport.getFieldOfView() * 1.5;
			let scale = this.viewport.scale * (viewportSize / rectSize);
			
			// set viewport
			//
			if (rectSize > 0) {
				let offset = this.view.model.getCenter().scaledBy(-this.viewport.pixelsPerMillimeter);
				if (this.options.duration == 0) {

					// zoom instantly
					//
					this.viewport.setOffset(offset);
					this.viewport.setScale(scale);				
				} else {

					// animate zoom
					//
					this.viewport.transformTo(offset, scale, this.options);

					// perform callback
					//
					if (this.options.onZoom) {
						this.options.onZoom();
					}
				}
			}
		}

		// call superclass method
		//
		MouseDragRectBehavior.prototype.onMouseUp.call(this, event);
	}
});

export default MouseDragZoomExtentsBehavior;