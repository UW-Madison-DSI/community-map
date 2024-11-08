/******************************************************************************\
|                                                                              |
|                        selectable-table-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract view that shows a selectable table item.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import TableItemView from '../../../views/collections/tables/table-item-view.js';
import Keyboard from '../../../views/keyboard/keyboard.js';

export default TableItemView.extend({

	//
	// events
	//

	events: {
		'mousedown': 'onMouseDown',
		'selectstart': 'onSelectStart'
	},

	//
	// querying methods
	//

	isSelected: function() {

		// check for selected class
		//
		return this.$el.hasClass('selected');
	},

	//
	// selecting methods
	//

	select: function() {

		// select row
		//
		this.$el.addClass('selected');

		// select element view associated with model
		//
		this.model.trigger('select');
	},

	deselect: function() {

		// unfocus row
		//
		this.$el.find('td[contenteditable="true"').blur();

		// deselect row
		//
		this.$el.removeClass('selected');

		// deselect element view associated with model
		//
		this.model.trigger('deselect');
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.options.parent.onSelect(this);
	},

	onDeselect: function() {
		this.options.parent.onDeselect(this);
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {

		// select current element
		//
		if (!this.isSelected()) {

			// if not shift clicking then deselect all
			//
			if (!this.options.parent.isKeyDown(Keyboard.keyCodes['shift'])) {
				this.options.parent.deselectAll();
			}

			this.select();
			this.onSelect();

		// deselect current
		//
		} else if (event.target.tagName.toLowerCase() == 'td') {

			// if not shift clicking then deselect all
			//
			if (!this.options.parent.isKeyDown(Keyboard.keyCodes['shift'])) {
				this.options.parent.deselectAll();
			} else {
				this.deselect();
				this.onDeselect();					
			}
		}
	},

	onSelectStart: function(event) {
		if (this.options.parent.isKeyDown(Keyboard.keyCodes['shift'])) {
			event.preventDefault();
		}
	}
});