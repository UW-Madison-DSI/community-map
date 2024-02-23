/******************************************************************************\
|                                                                              |
|                              highlightable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of highlighting behavior.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

export default {

	//
	// attributes
	//

	events: {
	
		// mouse events
		//
		'mouseover': 'onMouseOver',
		'mouseleave': 'onMouseLeave'
	},

	//
	// querying methods
	//

	isHighlighted: function() {
		return this.$el && this.$el.hasClass('highlighted');
	},
	
	//
	// selecting methods
	//

	highlight: function() {
		if (!this.isHighlighted()) {
			this.$el.addClass('highlighted');
		}
	},

	unhighlight: function() {
		if (this.isHighlighted()) {
			this.$el.removeClass('highlighted');
		}
	},

	//
	// mouse event handling methods
	//

	onMouseOver: function() {
		this.highlight();
	},

	onMouseLeave: function() {
		this.unhighlight();
	}
};