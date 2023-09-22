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
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ListItemView from '../../../views/sidebar/lists/list-item-view.js';

export default ListItemView.extend({

	//
	// attributes
	//

	tagName: 'div',
	className: 'item',

	template: _.template(`
		<span class="select"><input type="checkbox"<% if (checked) { %> checked<% } %> /></span>
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
		return {
			name: this.model.get('name'),
			count: this.model.get('count'),
			checked: this.options.checked
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