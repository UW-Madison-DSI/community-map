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
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ToolbarView from './toolbar-view.js';

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
	// getting methods
	//

	getValue: function() {
		return this.$el.find('input').val();
	},

	getSearchParams() {
		let urlSearchParams = new URLSearchParams(window.location.search);
		return Object.fromEntries(urlSearchParams.entries());
	},

	getQueryParams: function(params) {
		let query = this.getValue();
		params.set('query', query);

		// update params
		//
		params = this.parent.getChildView('date').getQueryParams(params);
		params = this.parent.getChildView('map').getQueryParams(params);

		let topView = this.getTopView();
		let sidebar = topView.getChildView('sidebar');
		if (sidebar && sidebar.getQueryParams) {
			params = sidebar.getQueryParams(params);
		}

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

		// configure ui
		//
		this.setQueryParams(params);
		if (this.parent.hasChildView('activities')) {
			this.parent.getChildView('activities').setQueryParams(params);
		}
		if (this.parent.hasChildView('map')) {
			this.parent.getChildView('date').setQueryParams(params);
		}

		// configure map view
		//
		this.setQueryParams(params);

		// set input
		//
		if (params.query && params.query != 'null') {
			this.search();
		}
	},

	updateQueryString: function() {
		let params = new URLSearchParams();

		// add query to params
		//
		params = this.getQueryParams(params);

		// set address bar
		//
		this.setQueryString(params.toString());
	},

	setQueryString: function(queryString) {
		let address = `${location.pathname}?${queryString}`;
		window.history.replaceState('', '', address);
	},

	pushQueryString: function(queryString) {
		let address = `${location.pathname}?${queryString}`;
		window.history.pushState('', '', address);
	},

	clearQueryString: function() {
		window.history.replaceState('', '', window.location.origin + window.location.pathname);
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
		this.pushQueryString(params.toString());

		if (query.includes('building')) {

			// string the word 'building' from search and trim whitespace
			//
			let search = query.replace(/building/g, '').replace(/^\s+|\s+$/gm, '');

			this.searchPlaces(search, {

				// callbacks
				//
				error: () => {
					application.showStatusDialog({
						title: 'Search Results',
						icon: 'fa fa-search',
						message: 'No buildings found.'
					});
				}
			});
		} else {

			// perform search
			//
			this.searchPeople(query, {
				exact: exact,

				// callbacks
				//
				error: () => {
					this.searchPlaces(query, {

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
		this.parent.getPeople(options.source).fetchAll({
			term: query,
			institution_unit: 10000,
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

				// check for exact matches
				//
				/*
				if (options && options.exact) {
					people = collection.filterByTopic(query);
				}
				*/

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

		this.parent.getPeople(options.source).fetchAll({
			name: name,
			institution_unit: 10000
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

					// autoselect first person
					//
					/*
					if (people.length == 1) {
						this.parent.peopleView.children.findByIndex(0).select();
					}
					*/
				} else {
					if (options && options.error) {
						options.error();
					} else {
						application.showStatusDialog({
							icon: 'fa fa-search',
							message: 'No people were found by that name.'
						});	
					}
					// this.getTopView().showDialog(new NoPeopleDialogView())
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
		this.clearQueryString();
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