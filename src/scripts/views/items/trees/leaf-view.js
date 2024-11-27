/******************************************************************************\
|                                                                              |
|                                 leaf-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a left view of a recursive tree.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ListItemView from '../../../views/items/lists/list-item-view.js';

export default ListItemView.extend({

	//
	// attributes
	//

	tagName: 'div',
	className: 'item',

	template: _.template(`
		<span class="select"><input type="checkbox"<% if (selected) { %> checked<% } %> /></span>
		<span class="name"><%= name %></span>
		<span class="count"><div class="badge"><%= count %></div></span>
	`),

	events: {
		'click': 'onClickItem',
		'click input': 'onClickItem'
	},

	//
	// constructor
	//

	initialize: function() {

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', this.render);
	},

	//
	// querying methods
	//

	isSelected: function() {
		return this.$el.find('input[type="checkbox"]').is(':checked');
	},

	//
	// selection methods
	//

	select: function() {
		this.$el.find('input[type="checkbox"]').prop('checked', true);
	},

	deselect: function() {
		this.$el.find('input[type="checkbox"]').prop('checked', false);
	},

	toggleSelected: function() {
		let selected = this.isSelected();
		if (selected) {
			this.deselect();
		} else {
			this.select();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let selected = this.options.selected == true;
		let name = this.model.get('name');
		let count = this.model.get('count');

		if (!selected && this.options.selected && this.options.selected.length > 0) {
			selected = this.options.selected.includes(name);
		}

		return {
			name: name,
			count: count,
			selected: selected
		}
	},

	//
	// mouse event handling methods
	//

	onClickItem: function() {
		this.toggleSelected();

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick();
		}
	},
});