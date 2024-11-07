/******************************************************************************\
|                                                                              |
|                                items-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an item list view.                                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	item: 'item',

	template: _.template(`
		<div class="<%= length == 0? 'empty ' : '' %><%= nested? 'header' : 'title' %>">
			<% if (icon) { %>
			<span class="<%= item.replace(/ /g, '-').replace(/_/g, '-') %> icon"><i class="<%= icon %>"></i></span>
			<% } %>
			<span class="count"><% if (length != 1) { %><%= length == 0? 'No' : length %><% } %></span>
			<%= items.replace(/_/g, ' ').toTitleCase() %>
		</div>

		<% if (closable) { %>
		<button class="btn" id="close" data-toggle="tooltip" title="Close" data-placement="right">
			<i class="fa fa-close"></i>
		</button>
		<% } %>

		<div class="items"></div>

		<% if (downloadable && length > 0) { %>
		<div class="buttons">
			<button>
				<i class="fa fa-download" data-toggle="tooltip" title="Download File"></i>
				<i class="fa fa-spinner spinning" style="display:none"></i>
			</button>
		</div>
		<% } %>
	`),

	regions: {
		items: '.items'
	},

	events: {
		'click #close': 'onClickClose',
		'click .sorting input': 'onClickSorting',
		'click .buttons button': 'onClickDownloadButton'
	},

	format: 'csv',

	//
	// constructor
	//

	initialize: function() {
		if (this.collection) {
			this.collection.sort();
		}
	},

	//
	// querying methods
	//

	toData: function(format) {
		switch (format) {
			case 'csv':
				return this.toCSV();
			case 'json':
				return this.toJSON();
		}
	},

	//
	// getting methods
	//

	getSorting: function() {
		return this.$el.find('.sorting input:checked').val();
	},

	className: function() {
		return this.getItemsName().replace(/ /g, '-') + ' info panel';
	},

	getFormat: function() {
		return this.$el.find('.format input:checked').val();
	},

	getItemsName: function() {
		return this.collection && this.collection.length == 1? this.item : this.item + 's';
	},

	getFilename: function() {
		return this.getItemsName() + '.' + this.getFormat();
	},

	//
	// setting methods
	//

	setDownloadLink: function(format) {
		this.$el.find('.download a').attr({
			'href': URL.createObjectURL(new Blob([this.toData(format)])),
			'download': this.getFilename()
		});
	},

	loadModels: function(options) {
		let numLoaded = 0;
		let numModels = this.collection.length;

		function increment() {
			numLoaded++;
			if (numLoaded == numModels) {
				if (options && options.done) {
					options.done();
				}
			}
		}

		for (let i = 0; i < numModels; i++) {
			let model = this.collection.at(i);
			if (model.loaded) {
				increment();
			} else {
				model.fetch({
					success: () => {
						increment();
					}
				})
			}
		}
	},

	//
	// selection methods
	//

	selectAll: function() {
		this.getChildView('items').selectAll();
	},

	deselectAll: function() {
		this.getChildView('items').deselectAll();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.icon,
			item: this.item,
			items: this.getItemsName(),
			format: this.format,
			length: this.collection? this.collection.length : 0,
			nested: this.options.nested,
			closable: true,
			downloadable: false
		};
	},

	onRender: function() {

		// show items
		//
		if (this.collection && this.collection.length > 0) {
			this.showItems();
		} else {
			this.$el.find('.items').hide();
		}

		// highlight terms
		//
		if (this.options && this.options.query) {
			this.getChildView('items').highlight(this.options.query, this.options);
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	showItems: function() {
		this.showChildView('items', new this.ItemsListView({
			collection: this.collection
		}));
	},

	showSpinner: function() {
		this.$el.find('.buttons button .fa-download').hide();
		this.$el.find('.buttons button .fa-spinner').show();
	},

	hideSpinner: function() {
		this.$el.find('.buttons button .fa-download').show();
		this.$el.find('.buttons button .fa-spinner').hide();
	},

	close: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');
		mainView.clearSearch();
	},

	//
	// mouse event handling methods
	//

	onClickClose: function() {
		this.close();
	},

	onClickSorting: function() {
		this.showItems();
	},

	onClickDownloadButton: function() {

		// load data
		//
		if (!this.loaded) {
			this.showSpinner();
			this.loadModels({

				// callbacks
				//
				done: () => {
					this.loaded = true;
					this.hideSpinner();

					// show download dialog
					//
					application.showDownloadDialog({
						items: this.getItemsName(),
						view: this
					});
				}
			});
		} else {

			// show download dialog
			//
			application.showDownloadDialog({
				items: this.getItemsName(),
				view: this
			});
		}
	}
});