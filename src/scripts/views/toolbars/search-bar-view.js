/******************************************************************************\
|                                                                              |
|                             search-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a search bar view.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import People from '../../collections/people.js';
import ToolbarView from '../../views/toolbars/toolbar-view.js';
import QueryString from '../../utilities/web/query-string.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	id: 'search-bar',

	template: _.template(`
		<input type="text" placeholder="Search.." />

		<div class="buttons">
			<button class="clear" type="button" data-toggle="tooltip" title="Clear" data-placement="bottom"><i class="fa fa-times"></i></button>
			<button class="search" type="button" data-toggle="tooltip" title="Search" data-placement="bottom"><i class="fa fa-search"></i></button>
		</div>
	`),

	events: {
		'click .search': 'onClickSearch',
		'click .clear': 'onClickClear',
		'click input': 'onClickInput',
		'keydown': 'onKeyDown'
	},

	//
	// querying methods
	//

	addQueryParams: function(params) {

		// add search to params
		//
		let query = this.getValue();
		if (query) {
			params.set('query', query);
		}

		// add map mode to params
		//
		params = this.parent.getChildView('map').addQueryParams(params);

		// add filters to params
		//
		let topView = this.getTopView();
		let sidebar = topView.getChildView('sidebar');
		if (sidebar && sidebar.getQueryParams) {
			params = sidebar.getQueryParams(params);
		}

		return params;
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.$el.find('input').val();
	},

	getSearchParams() {
		let urlSearchParams = new URLSearchParams(window.location.search);
		return Object.fromEntries(urlSearchParams.entries());
	},

	getQueryParams: function() {
		let params = new URLSearchParams();
		this.addQueryParams(params);
		return params;
	},

	//
	// setting methods
	//

	setQueryParams: function(params) {

		// set input
		//
		if (params.query && params.query != 'null') {
			this.$el.find('input').val(params.query);
		}
	},

	setQuery: function(query) {

		// set input
		//
		if (query && query != 'null') {
			this.$el.find('input').val(query);
		}
	},

	//
	// query string methods
	//

	parseQueryString: function() {
		const params = this.getSearchParams();

		// configure map view
		//
		this.setQueryParams(params);

		// set map mode from query params
		//
		if (params.mode) {
			if (this.parent.hasChildView('map')) {
				this.parent.getChildView('map').setMapMode(params.mode);
			}
		}

		// set input
		//
		if (params.query && params.query != 'null') {
			this.search();
		}
	},

	updateQueryString: function() {

		// add query to params
		//
		let params = this.getQueryParams();

		// set address bar
		//
		QueryString.set(params.toString());
	},

	//
	// querying methods
	//

	isQuotated: function(string) {
		return string && string[0] == '"' && string[string.length - 1] == '"';
	},

	unQuotated: function(string) {
		return string.substring(1, string.length - 1);
	},

	//
	// searching methods
	//

	searchFor: function(query, options) {

		// configure UI
		//
		this.setQuery(query, options);

		// perform search
		//
		this.search({
			clear: true
		});
	},

	search: function(options) {
		let query = this.getValue();
		let exact = false;

		// clear map
		//
		this.parent.clear();

		if (query == '') {
			return;
		}

		const params = new URLSearchParams(location.search);
		params.set('query', query);

		if (options && options.clear) {
			params.delete('info');
		}

		// perform exact search
		//
		if (this.isQuotated(query)) {
			query = this.unQuotated(query);
			exact = true;
		}

		// set address bar
		//
		QueryString.push(params.toString());

		// perform search
		//
		if (query.includes('building') || query.includes('lot') || 
			query.includes('parking') || query.includes('parking lot')) {

			// search for buildings
			//
			this.searchBuildings(query, {
				exact: exact
			});

		} else {

			// search for people
			//
			this.searchPeople(query, {
				exact: exact,

				// callbacks
				//
				error: () => {
					this.searchPlaces(query, {
						exact: exact,

						// callbacks
						//
						error: () => {
							application.showStatusDialog({
								title: 'Search Results',
								icon: 'fa fa-search',
								message: "No people were found related to '" + query + "'."
							});
						}
					});
				}
			});
		}
	},

	searchBuildings: function(query, options) {

		// strip the word 'building' from search and trim whitespace
		//
		query = query.replace(/building/g, '').replace(/^\s+|\s+$/gm, '');
		query = query.replace(/parking lot/g, 'lot');
		query = query.replace(/parking/g, 'lot');

		this.searchPlaces(query, _.extend({}, options, {

			// callbacks
			//
			error: () => {
				application.showStatusDialog({
					title: 'Search Results',
					icon: 'fa fa-search',
					message: 'No buildings found.'
				});
			}
		}));
	},

	searchPeople: function(query, options) {
		this.searchPeopleByTopic(query, _.extend({}, options, {

			// callbacks
			//
			success: (people) => {

				// search people by name
				//
				if (!people || people.length == 0) {
					this.searchPeopleByName(query, options);
				}
			}
		}));
	},

	searchPeopleByTopic: function(query, options) {

		// show status message
		//
		if (application.dialog) {
			application.showStatusDialog({
				icon: 'fa fa-search',
				message: 'Searching for people...'
			});
		}

		// find people associated with label
		//
		new People().fetchAll({
			term: query,
			community: defaults.community,
			exact: options.exact
		}, {

			// options
			//
			source: options? options.source : undefined,
			exact: options? options.exact : undefined,

			// callbacks
			//
			success: (collection) => {
				let people = collection.models;

				// hide status message
				//
				application.hideDialogs();

				// show results
				//
				this.showPeople(people, {
					query: query,
					zoom_to: true
				});

				// perform callback
				//
				if (options && options.success) {
					options.success(people);
				}
			},

			error: () => {
				if (options && options.error) {
					options.error();
				} else {
					application.showStatusDialog({
						icon: 'fa fa-search',
						message: 'No people were found that match this topic.'
					});
				}
			}
		});
	},

	searchPeopleByName: function(name, options) {

		// show status message
		//
		if (!application.dialog) {
			application.showStatusDialog({
				icon: 'fa fa-search',
				message: 'Searching for people...'
			});
		}

		new People().fetchAll({
			name: name,
			community: defaults.community
		}, {

			// callbacks
			//
			success: (collection) => {
				let people = collection.models;

				// hide status message
				//
				application.hideDialogs();

				if (people.length > 0) {

					// check for exact matches
					//
					if (options && options.exact) {
						let matches = collection.filterByName(name);
						if (matches && matches.length > 0) {
							people = matches;
						}
					}

					// show results
					//
					this.showPeople(people, {
						query: name,
						zoom_to: true
					});
				} else {
					if (options && options.error) {
						options.error();
					} else {
						application.showStatusDialog({
							icon: 'fa fa-search',
							message: 'No people were found by that name.'
						});	
					}
				}
			}
		});
	},

	searchPlaces: function(query, options) {
		let buildings = this.parent.buildings.findByName(query, options);

		this.parent.buildingsView.deselectAll();
		if (buildings.length > 0) {
			this.parent.showPlaces(buildings);
		} else {
			if (options && options.error) {
				options.error();
			} else {
				application.showStatusDialog({
					icon: 'fa fa-search',
					message: 'No places found.'
				});
			}
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// add back button handler
		//
		$(window).on('popstate', () => {
			window.setTimeout(() => {
				this.parseQueryString();
			}, 500);
		});
	},

	clear: function() {
		this.$el.find('input').val('');
		this.parent.clear();
		this.parent.showAll();
		this.parent.labelsView.deselectAll();
		QueryString.delete('query');
	},

	//
	// overlay display methods
	//

	showPeople: function(people, options) {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');

		if (people.length > 1) {
			mainView.showPeople(people, options);
		} else if (people.length == 1) {
			mainView.showPerson(people[0], options);
		}
	},

	showActivity: function(activity, collection, options) {
		if (collection.length > 0) {
			this.parent.showActivity(activity, collection, options);
		}
	},

	//
	// mouse event handling methods
	//

	onChangeSelect: function() {
		this.updateQueryString();
	},

	onClickSearch: function() {
		this.search();
	},

	onClickClear: function() {
		this.clear();
		this.parent.resetView();
		this.parent.setMapMode('map');
	},

	onClickInput: function(event) {
		this.$el.find('input').focus();

		// block from parent
		//
		event.stopPropagation();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (event.keyCode == 13) {
			this.$el.find('.search').trigger('click');
		}

		// block events
		//
		if (event.target.type == 'text') {
			event.stopPropagation();
		}
	}
});