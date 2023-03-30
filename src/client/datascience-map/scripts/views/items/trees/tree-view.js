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
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
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
			<span class="select"><input type="checkbox"<% if (checked) { %> checked<% } %> /></span>
			<span class="name"><%= name %></span>
			<span class="count"><div class="badge"><%= count %></div></span>
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

		// set attributes
		//
		if (!this.options) {
			this.options = {};
		}
		if (!this.options.expanded) {
			this.options.expanded = false;
		}

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

	getCount: function(countFunction) {
		let count = 0;
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if (childView.getCount) {
				count += childView.getCount(countFunction);
			} else {
				count += childView.model.get('count');
			}
		}
		return count;
	},

	getUniqueModelCount: function(countFunction, countedModels) {
		let count = 0;
		if (!countedModels) {
			countedModels = [];
		}
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if (childView.getUniqueModelCount) {
				count += childView.getUniqueModelCount(countFunction, countedModels);
			} else {
				count += countFunction(childView.model.get('name'), countedModels);
			}
		}
		return count;
	},

	//
	// setting methods
	//

	setValues: function(names) {
		/*
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if (childView instanceof this.constructor) {
				childView.setValues(names);
			} else if (names.includes(childView.model.get('name'))) {
				childView.select();
			}
		}
		*/

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
			count: this.model? this.model.get('count') : '',
			checked: this.options.checked
		};
	},

	onRender: function() {
		let expand = false;

		// handle tree roots
		//
		if (!this.options.parent) {
			this.$el.addClass('root');
			this.$el.find('> .item:first-child').addClass('first');

		}

		// decide whether to expand tree
		//
		let category = this.options.parent? this.model.get('name') : 'All';
		if (this.options.expanded) {
			if (this.options.expanded.length > 0) {
				expand = this.options.expanded.includes(category);
			} else {
				expand = this.options.expanded === true;
			}
		}

		// set initial state
		//
		if (expand) {
			this.expand();
		}
	},

	buildChildView: function (child) {
		if (!child.has('collection')) {
			return new LeafView({
				model: child,

				// options
				//
				checked: this.options.checked,
				parent: this,

				// callbacks
				//
				onclick: this.options.onclick
			});
		} else {
			return new this.constructor({
				model: child,

				// options
				//
				collection: child.get('collection'),
				expanded: this.options.expanded,
				checked: this.options.checked,
				parent: this,

				// callbacks
				//
				onclick: this.options.onclick
			});
		}
	},

	childViewOptions: function() {
		return {
			onclick: this.options.onclick,
			checked: this.options.checked
		};
	},

	//
	// counting mrthods
	//

	showChildCounts: function(countFunction) {
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if (childView.showChildCounts) {
				childView.showChildCounts(countFunction);
			} else {
				childView.model.set({
					count: countFunction(childView.model.get('name'))
				});
			}
		}

		// show cumulative counts
		//
		this.$el.find('> .item .count .badge').text(this.getUniqueModelCount(countFunction));
	},

	showCounts: function() {
		this.showChildCounts(this.options.count);
	},

	//
	// mouse event handling methods
	//

	onClickCheckbox: function() {
		this.toggleChildrenSelected();

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick();
		}
	},

	onClickName: function() {
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