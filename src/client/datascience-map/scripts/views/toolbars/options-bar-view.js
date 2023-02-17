/******************************************************************************\
|                                                                              |
|                            options-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a toolbar view for options settings.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ToolbarView from './toolbar-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	id: 'options-bar',
	className: 'vertical toolbar visible-xs',

	template: _.template(`
		<div class="buttons">
			<button id="show-filters" data-toggle="tooltip" title="Show / Hide Filters" data-placement="left">
				<i class="fa fa-bars"></i>
			</button>
		</div>
	`),

	events: {
		'click #show-filters': 'onClickShowFilters'
	},

	//
	// querying methods
	//

	isFiltersSelected: function() {
		return this.$el.find('#show-filters').hasClass('selected');
	},

	//
	// setting methods
	//

	setFilters: function(selected) {
		if (selected) {
			this.$el.find('#show-filters').addClass('selected');
			this.parent.parent.openSideBar();
		} else {
			this.$el.find('#show-filters').removeClass('selected');
			this.parent.parent.closeSideBar();
		}
	},

	//
	// mouse event handling methods
	//

	onClickShowFilters: function() {

		// toggle state
		//
		this.setFilters(!this.isFiltersSelected());
	}
});