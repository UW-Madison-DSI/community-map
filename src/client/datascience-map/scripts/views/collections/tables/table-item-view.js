/******************************************************************************\
|                                                                              |
|                              table-item-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract view that shows a single table item.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2022, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListItemView from '../../../views/collections/lists/list-item-view.js';

export default ListItemView.extend({

	//
	// attributes
	//

	tagName: 'tr'
});