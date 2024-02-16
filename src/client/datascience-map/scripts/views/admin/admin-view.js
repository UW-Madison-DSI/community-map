/******************************************************************************\
|                                                                              |
|                               admin-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level view of our application.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import People from '../../collections/people.js';
import InstitutionUnits from '../../collections/institution-units.js';
import SplitView from '../../views/layout/split-view.js';
import AdminSidebarView from '../../views/admin/admin-sidebar-view.js';
import UsersView from '../../views/admin/users-view.js';

export default SplitView.extend({

	//
	// attributes
	//

	id: 'admin split',

	//
	// methods
	//

	getSideBarView: function() {
		return new AdminSidebarView({
			collection: this.users
		});
	},

	getMainBarView: function() {
		return new UsersView({
			collection: this.users
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show splitter
		//
		this.showSplitter();

		// fetch
		//
		new InstitutionUnits().fetch({

			// callbacks
			//
			success: (collection) => {

				// cache collection
				//
				InstitutionUnits.collection = collection;

				// fetch list of users
				//
				new People().fetch({

					// callbacks
					//
					success: (users) => {
						this.users = users;
						this.showChildViews();
					}
				});
			}
		});
	},

	showChildViews: function() {

		// show child views
		//
		if (this.getSideBarView) {
			this.showChildView('sidebar', this.getSideBarView());
		}
		if (this.getMainBarView) {
			this.showChildView('mainbar', this.getMainBarView());
		}
	}
});