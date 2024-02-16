/******************************************************************************\
|                                                                              |
|                               users-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an admin view of a list of current users.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';
import PeopleListView from '../../views/items/people/people-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'content',

	template: _.template(`
		<div class="users-list"></div>
	`),

	regions: {
		users: '.users-list'
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showUsers();
	},

	showUsers: function() {
		this.showChildView('users', new PeopleListView({
			collection: this.collection
		}));
	}
});