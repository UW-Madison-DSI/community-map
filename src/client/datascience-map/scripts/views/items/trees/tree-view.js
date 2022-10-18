/******************************************************************************\
|                                                                              |
|                                 tree-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a recursive directory tree.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2022, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CollectionView from '../../../views/collections/collection-view.js';
import LeafView from '../../../views/items/trees/leaf-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'div',
	className: 'tree',
	childView: LeafView,
	childViewContainer: '.children',

	template: _.template(`
		<div class="item">
			<div class="expander">
				<i class="collapse fa fa-caret-down"</div></i>
				<i class="expand fa fa-caret-right"</div></i>
			</div>
			<span class="select"><input type="checkbox" checked /></span>
			<span class="name"><%= name %></span>
		</div>

		<div class="children"></div>
	`),

	events: {
		'click > .item input': 'onClickCheckbox',
		'click > .item .name': 'onClickName',
		'click .expander': 'onClickExpander'
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

	isExpanded: function() {
		return this.$el.hasClass('expanded');
	},

	isSelected: function() {
		return this.$el.find('> .item input[type="checkbox"]').is(':checked');
	},

	isAllSelected: function() {
		return this.$el.find('input[type="checkbox"]:not(:checked)').length == 0;
	},

	//
	// getting methods
	//

	getValues: function() {
		let names = [];
		this.$el.find('input:checked').each(function() {
			let name = $(this).closest('.item').find('.name').text();
			if (name != 'All') {
				names.push(name);
			}
		});
		return names;
	},

	//
	// setting methods
	//

	setValues: function(names) {
		this.$el.find('.item').each(function() {
			let name = $(this).find('.name').text().trim();
			let checked = names? names.includes(name) : false;
			$(this).find('input').prop('checked', checked);
		});
	},

	//
	// children selecting methods
	//

	selectChildren: function() {
		this.$el.find('.children input[type="checkbox"]').prop('checked', true);
	},

	deselectChildren: function() {
		this.$el.find('.children input[type="checkbox"]').prop('checked', false);
	},

	toggleChildrenSelected: function() {
		let selected = this.isSelected();
		if (selected) {
			this.selectChildren();
		} else {
			this.deselectChildren();
		}
	},

	//
	// group selecting methods
	//

	selectAll: function() {
		this.$el.find('input[type="checkbox"]').prop('checked', true);
	},

	deselectAll: function() {
		this.$el.find('input[type="checkbox"]').prop('checked', false);
	},

	toggleAllSelected: function() {
		let selected = this.isSelected();
		if (selected) {
			this.deselectAll();
		} else {
			this.selectAll();
		}
	},

	//
	// expanding methods
	//

	expand: function() {
		this.$el.addClass('expanded');
	},

	collapse: function() {
		this.$el.removeClass('expanded');
	},

	toggleExpanded: function() {
		if (this.isExpanded()) {
			this.collapse();
		} else {
			this.expand();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model? this.model.get('name'): 'All',
			count: this.model? this.model.get('count') : ''
		};
	},

	onRender: function() {
		if (!this.options.parent) {
			this.$el.addClass('expanded root');
			this.$el.find('> .item:first-child').addClass('first');
		}

		// set initial state
		//
		if (this.model && this.options.expanded.includes(this.model.get('name'))) {
			this.expand();
		}
	},

	buildChildView: function (child) {
		if (!child.has('collection')) {
			return new LeafView({
				model: child,
				parent: this,

				// callbacks
				//
				onclick: this.options.onclick
			});
		} else {
			return new this.constructor({
				model: child,
				collection: child.get('collection'),
				expanded: this.options.expanded,
				parent: this,

				// callbacks
				//
				onclick: this.options.onclick
			});
		}
	},

	childViewOptions: function(child) {
		return {
			onclick: this.options.onclick
		};
	},

	//
	// counting mrthods
	//

	showChildCounts: function(collection) {
		for (let i = 0; i < collection.length; i++) {
			let model = collection.at(i);
			model.set({
				count: this.options.count(model.get('name'))
			});
			if (model.has('collection')) {
				this.showChildCounts(model.get('collection'));
			}
		}
	},

	showCounts: function() {
		this.showChildCounts(this.collection);
	},

	//
	// mouse event handling methods
	//

	onClickCheckbox: function(event) {
		this.toggleChildrenSelected();

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick();
		}
	},

	onClickName: function(event) {
		this.toggleAllSelected();

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick();
		}
	},

	onClickExpander: function(event) {
		this.toggleExpanded();
		event.stopPropagation();
	}
});