/******************************************************************************\
|                                                                              |
|                               toolbar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the toolbar used to hide and show activities.            |
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

	className: 'toolbar',

	//
	// constructor
	//

	initialize(options) {

		// set attributes
		//
		this.options = options || {};
		this.parent = options? options.parent : undefined;

		// render
		//
		this.onRender();

		// add button clicks
		//
		/*
		this.$el.find('button').on('click', () => {
			Sounds.play('click');
		});
		*/
	},

	//
	// querying methods
	//

	isVisible: function() {
		return this.$el.is(':visible');
	},

	//
	// rendering methods
	//

	onRender: function() {

		// add tooltip triggers
		//
		this.addTooltips({
			placement: 'left'
		});

		// add bounce effect to buttons
		//
		this.addBounceEffect();
	},

	addBounceEffect: function() {
		this.$el.find('button').mouseenter((event) => {
			let $button = $(event.target).closest('button');
			$button.addClass('bouncing');
			window.setTimeout(() => {
				$button.removeClass('bouncing');
			}, 300);
		});
	}
});