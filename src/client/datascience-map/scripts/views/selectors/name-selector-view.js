/******************************************************************************\
|                                                                              |
|                               name-selector-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting an item from a list of names.       |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';
import '../../../vendor/bootstrap/js/dropdown.js';

export default BaseView.extend({

	//
	// attributes
	//

	events: {
		'change': 'onChange',
		'click .dropdown-menu li': 'onClickMenuItem'
	},

	//
	// methods
	//

	initialize: function() {

		// set initial value
		//
		this.selected = this.options.initialValue;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			selected: this.selected
		};
	},

	onRender: function() {

		// apply select2 selector
		//
		this.selector = $(this.$el.find("select").select2({
			width: '100%'
		}));
	},

	//
	// querying methods
	//

	getSelectedIndex: function() {
		return this.$el.find('select')[0].selectedIndex;
	},

	getSelected: function() {
		return this.selected;
	},

	getSelectedName: function() {
		return this.selected? this.selected.get('name') : '';
	},

	hasSelected: function() {
		return this.getSelected() !== undefined;
	},

	getItemByIndex: function(index) {
		return this.collection.at(index);
	},

	getOptionByName: function(name) {
		let options = this.$el.find('select')[0].options;
		for (let i = 0; i < options.length; i++) {
			if (options[i].value == name) {
				return i;
			}
		}
	},

	//
	// setting methods
	//

	setSelectedName: function(selectedName) {
		this.setSelectedIndex(this.getOptionByName(selectedName));
		this.onChange();
	},

	setSelectedIndex: function(index) {
		this.$el.find('select')[0].selectedIndex = index;
	},

	//
	// event handling methods
	//

	onChange: function() {

		// set value
		//
		this.selected = this.getItemByIndex(this.getSelectedIndex());

		// perform callback
		//
		if (this.options.onChange) {
			this.options.onChange();
		}
	},

	onClickMenuItem: function () {
		if (this.onclickmenuitem) {
			this.onclickmenuitem();
		}
	}
});