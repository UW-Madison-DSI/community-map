/******************************************************************************\
|                                                                              |
|                                 list-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a sidebar list view.                                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import CollectionView from '../../../views/collections/collection-view.js';
import ListItemView from '../../../views/collections/lists/list-item-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'ol',
	childView: ListItemView,

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return {
			model: model,
			parent: this,

			// callbacks
			//
			onclick: this.options.onclick,
			onmouseover: this.options.onmouseover,
			onmouseleave: this.options.onmouseleave
		};
	},

	highlight: function(text, options) {
		for (let i = 0; i < this.children.length; i++) {
			this.children.findByIndex(i).highlight(text, options);
		}
	}
});