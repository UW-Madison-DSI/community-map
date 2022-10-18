/******************************************************************************\
|                                                                              |
|                                 list-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view for displaying a generic list.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2022, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import CollectionView from '../../../views/collections/collection-view.js';
import ListItemView from '../../../views/collections/lists/list-item-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	// views
	//
	childView: ListItemView,
	emptyView: BaseView.extend({
		template: _.template("No items.")
	}),

	//
	// constructor
	//

	initialize: function() {

		// watch collection
		//
		this.listenTo(this.collection, 'add', this.update, this);
		this.listenTo(this.collection, 'remove', this.update, this);
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.$el.find('table').wrap('<div class="table-responsive"></div>');
	},

	//
	// updating methods
	//

	update: function() {

		// renumber (if list is numbered)
		//
		this.renumber();
	},

	renumber: function() {
		let count = 1;
		this.$el.find('td.number').each((index, element) => {
			$(element).html(count++);
		});
	}
});