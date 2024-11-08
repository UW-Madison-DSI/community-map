/******************************************************************************\
|                                                                              |
|                                   main.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application entry point and loading.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import '../library/jquery/jquery-3.6.0.js';
import '../library/lodash/lodash.js';
import '../library/backbone/backbone.js';
import '../library/backbone/marionette/backbone.marionette.js';
import '../vendor/jquery/mouse-wheel/jquery.mousewheel.js';
import '../vendor/jquery/jquery-ui/jquery-ui.js';

// load configuration files
//
Promise.all([
	fetch('config/config.json').then(response => response.json()),
	fetch('config/defaults.json').then(response => response.json()),
]).then((files) => {
	window.config = files[0];
	window.defaults = files[1];
	window.community_defaults = {};

	// set web page title
	//
	if (window.defaults.navbar.title) {
		document.title = window.defaults.navbar.title;
	}

	function start() {
		$(document).ready(() => {
			import('./application.js').then((Application) => {

				// set global for future reference
				//
				application = new Application.default();

				// go!
				//
				$(document).ready(function() {
					application.start();
				});
			});
		});
	}

	// load terms for each community
	//
	for (let i = 0; i < defaults.communities.length; i++) {
		let community = defaults.communities[i];
		let filename = 'config/' + community + '.json';

		fetch(filename)
			.then((response) => response.json())
			.then((json) => {

				// store json for later reference
				//
				window.community_defaults[community] = json;

				// check if all communities have been loaded
				//
				if (Object.keys(window.community_defaults).length == defaults.communities.length) {
					start();
				}
			});
	}
});