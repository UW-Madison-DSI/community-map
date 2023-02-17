/******************************************************************************\
|                                                                              |
|                         editable-table-item-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract view that shows an editable table item.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import SelectableTableItemView from '../../../views/collections/tables/selectable-table-item-view.js';
import Timeable from '../../../views/behaviors/effects/timeable.js';
import Keyboard from '../../../views/keyboard/keyboard.js';

export default SelectableTableItemView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	events: _.extend({}, SelectableTableItemView.prototype.events, {
		'mousedown [contenteditable="true"]': 'onMouseDownContentEditable',
		'mousedown input[type="checkbox"]': 'onMouseDownCheckbox',
		'keydown': 'onKeyDown'
	}),

	// editable attributes
	//
	editingDelay: 500,

	//
	// editing methods
	//

	editElementAfterDelay: function(element) {
		if (!this.timeout) {

			// make name editable after slight delay
			//
			this.setTimeout(() => {
				this.timeout = null;

				// make name editable
				//
				$(element).focus();
			}, this.editingDelay);
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDownContentEditable: function (event) {
		if (this.isSelected()) {
			this.editElementAfterDelay(event.target);
					
			// prevent focusing until after delay
			//
			if (this.$el.find('td:focus').length == 0) {
				event.preventDefault();
			}

			// prevent deselect
			//
			event.stopPropagation();
		}
	},

	onMouseDownCheckbox: function(event) {

		// prevent deselect
		//
		event.stopPropagation();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (event.keyCode == Keyboard.keyCodes['enter']) {

			// blur focused element
			//
			this.$el.find('td:focus').blur();

			// block
			//
			event.stopPropagation();
			event.preventDefault();
		}
	}
}));