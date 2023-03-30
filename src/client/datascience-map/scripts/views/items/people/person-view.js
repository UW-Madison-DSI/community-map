/******************************************************************************\
|                                                                              |
|                               person-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an item list view.                                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import '../../../../vendor/bootstrap/js/tab.js';
import BaseView from '../../../views/base-view.js';
import ProfileView from '../../../views/items/people/profile/profile-view.js';
import CollaboratorsView from '../../../views/items/collaborators/collaborators-view.js';
import AddressBar from '../../../utilities/web/address-bar.js';

// activity views
//
import GrantsView from '../../../views/items/activities/grants/grants-view.js';
import ArticlesView from '../../../views/items/activities/articles/articles-view.js';
import AwardsView from '../../../views/items/activities/awards/awards-view.js';
import BookChaptersView from '../../../views/items/activities/book-chapters/book-chapters-view.js';
import BooksView from '../../../views/items/activities/books/books-view.js';
import ConferenceProceedingsView from '../../../views/items/activities/conference-proceedings/conference-proceedings-view.js';
import PatentsView from '../../../views/items/activities/patents/patents-view.js';
import TechnologiesView from '../../../views/items/activities/technologies/technologies-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	item: 'person',

	template: _.template(`

		<% if (editable) { %>
		<div class="buttons">
			<button class="edit-person btn btn-primary">
				<i class="fa fa-pencil"></i>Edit My Profile
			</button>
			<button class="return-to-map btn">
				<i class="fa fa-map"></i>Return To Map
			</button>
		</div>
		<% } %>

		<div class="info panel">
			<% if (closable) { %>
			<button class="btn" id="close" data-toggle="tooltip" title="Close" data-placement="right">
				<i class="fa fa-close"></i>
			</button>
			<% } %>

			<div class="title">
				<% if (!profile_photo_url) { %>
				<div class="icon">
					<% if (title && title == 'Professor') { %>
					<i class="fa fa-user-graduate"></i>
					<% } else { %>
					<i class="fa fa-user"></i>
					<% } %>
				</div>
				<% } else { %>
				<img class="profile-photo" src="<%= profile_photo_url %>" />
				<% } %>

				<div class="name">
					<% if (first_name) { %><span class="first-name"><%= first_name %></span><% } %>
					<% if (middle_name) { %><span class="middle-name"><%= middle_name %></span><% } %>
					<% if (last_name) { %><span class="last-name"><%= last_name %></span><% } %>
				</div>

				<% if (title) { %>
				<div class="subtitle"><%= title %></div>
				<% } %>
			</div>

			<ul class="nav nav-tabs" role="tablist">
				<li role="presentation" class="profile tab active" data-toggle="tooltip" title="Profile">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-info-circle"></i>
						<i class="fa fa-spinner spinning" style="display:none"></i>
					</a>
				</li>
				<li role="presentation" class="collaborators tab" data-toggle="tooltip" title="Collaborators">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-users"></i>
					</a>
				</li>
				<li role="presentation" class="grants tab" data-toggle="tooltip" title="Grants">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-money-check-dollar"></i>
					</a>
				</li>
				<li role="presentation" class="articles tab" data-toggle="tooltip" title="Articles">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-file-text"></i>
					</a>
				</li>
				<li role="presentation" class="book-chapters tab" data-toggle="tooltip" title="Book Chapters">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-book-open"></i>
					</a>
				</li>
				<li role="presentation" class="books tab" data-toggle="tooltip" title="Books">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-book"></i>
					</a>
				</li>
				<li role="presentation" class="conference-proceedings tab" data-toggle="tooltip" title="Conference Proceedings">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-microphone"></i>
					</a>
				</li>
				<li role="presentation" class="patents tab" data-toggle="tooltip" title="Patents">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-lightbulb"></i>
					</a>
				</li>
				<li role="presentation" class="technologies tab" data-toggle="tooltip" title="Technologies">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-gear"></i>
					</a>
				</li>
				<li role="presentation" class="awards tab" data-toggle="tooltip" title="Awards">
					<a class="icon" role="tab" data-toggle="tab">
						<i class="fa fa-trophy"></i>
					</a>
				</li>
			</ul>
		
			<div class="details"></div>
		</div>
	`),

	regions: {
		details: '.details'
	},

	events: {
		'click .nav-tabs > li > a': 'onClickTab',
		'click #close': 'onClickClose',
		'click .edit-person': 'onClickEditPerson',
		'click .return-to-map': 'onClickReturnToMap'
	},

	//
	// mouse event handling methods
	//

	onClickAddPerson: function() {
		this.getTopView().showAddPersonDialog();
	},

	//
	// querying methods
	//

	toCSV: function() {
		let csv = '';
		csv += 'First Name, ';
		csv += 'Middle Name, ';
		csv += 'Last Name, ';
		csv += 'Primary Affiliation, ';
		csv += 'Other Affiliations, ';
		csv += 'Interests ';
		csv += '\n';
		csv += (this.model.get('first_name') || '') + ',';
		csv += (this.model.get('middle_name') || '') + ',';
		csv += (this.model.get('last_name') || '') + ',';
		csv += (this.model.get('primary_affiliation') || '') + ',';
		csv += '"' + this.model.getSecondaryAffiliations().join(', ') + '",';
		csv += '"' + this.model.get('interests').join(', ') + '"';
		csv += '\n';
		return csv;
	},

	toJSON: function() {
		let data = [];
		data.push({
			'First Name': this.model.get('first_name'),
			'Middle Name': this.model.get('middle_name'),
			'Last Name': this.model.get('last_name'),
			'Primary Affiliation': this.model.get('primary_affiliation'),
			'Other Affiliations': this.model.getSecondaryAffiliations(),
			'Interests': this.model.get('interests')
		});
		return JSON.stringify(data, null, 4);
	},

	addQueryParams: function(params) {

		// add activity to params
		//
		if (this.info && this.info != 'profile') {
			params.set('info', this.info);
		}

		return params;
	},

	//
	// getting methods
	//

	getSearchParams: function() {
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

	setActiveTab: function(tab) {
		this.$el.find('li.active').removeClass('active');
		this.$el.find('li.' + tab.replace(/_/g, '-')).addClass('active');
	},

	setYear: function(value) {
		if (this.hasChildView('details') && this.getChildView('details').setYear) {
			this.getChildView('details').setYear(value);
		}
	},

	setRange: function(values) {
		if (this.hasChildView('details') && this.getChildView('details').setRange) {
			this.getChildView('details').setRange(values);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');

		return {
			profile_photo_url: this.model.getProfilePhotoUrl(),
			other_affiliations: this.model.getSecondaryAffiliations(),
			editable: this.options.editable,
			closable: !mainView.savedPeople != undefined && !this.options.editable
		};
	},

	onRender: function() {
		let info = this.getSearchParams().info || 'profile';

		// set initial state
		//
		this.$el.find('li').hide();
		this.$el.find('li.profile').show();
		this.setActiveTab(info);
		this.showInfo(info);

		// fetch model counts
		//
		this.showSpinner();
		this.model.clone().fetch({

			// callbacks
			//
			success: (model) => {
				this.hideSpinner();
				this.showCounts(model);
			}
		});

		// hide close button
		//
		/*
		if (!mainView.savedPeople || mainView.savedPeople.length <= 1) {
			this.$el.find('#close').hide();
		}
		*/

		// add tooltip triggers
		//
		this.addTooltips();
	},

	showInfo: function(info) {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');
		let mapView = mainView.getChildView('mainbar');
		let personView;

		// set defaults
		//
		if (!info) {
			info = 'profile';
		}

		if (mapView.peopleView) {
			personView = mapView.peopleView.children.findByModel(this.model);
			if (!personView) {
				personView = mapView.peopleView.children.findByIndex(0);
			}
			this.personView = personView;

			// show only one activity at a time
			//
			if (this.info == 'collaborators') {
				personView.hideCollaborators();
			} else if (this.info != 'profile') {
				personView.hideActivity(this.info);
			}
		}

		this.info = info;

		// update query string
		//
		/*
		if (mapView.hasChildView('search')) {
			mapView.getChildView('search').updateQueryString();
		}
		*/

		switch (info) {

			case 'profile':
				this.showProfile();

				// configure map view
				//
				mapView.hideDateBar();
				mapView.hideActivitiesBar();
				break;

			case 'collaborators':
				personView.showCollaborators({

					// callbacks
					//
					done: (collaboratorsView) => {
						this.showCollaborators();

						// configure map view
						//
						mapView.showDateBar();
						mapView.hideActivitiesBar();

						// zoom to collaborators
						//
						if (collaboratorsView) {
							mapView.zoomToLocations(collaboratorsView.getLocations());
						}
					}
				});
				break;

			default:
				personView.showActivity(info, {

					// callbacks
					//
					done: (activitiesView) => {
						this.showActivity(info);

						// configure map view
						//
						mapView.showDateBar();
						mapView.showActivitiesBar();

						// update activity date
						//
						mapView.getChildView('date').update();

						// zoom to activity
						//
						if (activitiesView) {
							mapView.zoomToLocations(activitiesView.getLocations());
						}
					}
				});
				break;
		}
	},

	showProfile: function() {
		this.showChildView('details', new ProfileView({
			model: this.model,
			query: this.options.query
		}));
	},

	addBadge: function(element, count) {
		$(element).append($('<span class="badge">' + count + '</span>'));
	},

	updateTabCount: function(element, count) {
		if (count == 0) {
			element.hide();
		} else {
			element.show();
			this.addBadge(element, count);
		}
	},

	showCounts: function(model) {
		this.updateTabCount(this.$el.find('li.collaborators'), model.get('num_collaborators'));
		this.updateTabCount(this.$el.find('li.grants'), model.get('num_grants'));
		this.updateTabCount(this.$el.find('li.articles'), model.get('num_articles'));
		this.updateTabCount(this.$el.find('li.book-chapters'), model.get('num_book_chapters'));
		this.updateTabCount(this.$el.find('li.books'), model.get('num_books'));
		this.updateTabCount(this.$el.find('li.conference-proceedings'), model.get('num_conference_proceedings'));
		this.updateTabCount(this.$el.find('li.patents'), model.get('num_patents'));
		this.updateTabCount(this.$el.find('li.technologies'), model.get('num_technologies'));
		this.updateTabCount(this.$el.find('li.awards'), model.get('num_awards'));
	},

	showCollaborators: function() {
		let collection = this.model.get('collaborators');
		// let topView = this.getTopView();
		// let mainView = topView.getChildView('content');
		// let mapView = topView.getChildView('mainbar');
		// let range = mapView.getChildView('date').range;
		// let color = 'grey';

		this.showChildView('details', new CollaboratorsView({
			collection: collection,
			nested: true,

			// callbacks
			//
			onclick: (item) => {
				let view = this.personView.collaboratorsView.children.findByModel(item.model);
				let topView = this.getTopView();
				let mainView = topView.getChildView('content');
				let mapView = mainView.getChildView('mainbar');

				// reset map
				//
				mapView.deselectAll();
				mapView.clearPopovers();

				// select collaborator marker
				//
				view.toTop();
				view.markerView.select();
				mapView.goTo(view.markerView.location, 1, {

					// callbacks
					//
					done: () => {
						view.markerView.showPopover();
					}
				});
			}
		}));

		// mainView.showTrends('collaborators', range, collection, color);
	},

	showActivityView(ActivityView, activity) {
		let collection = this.model.get(activity);
		// let topView = this.getTopView();
		// let mainView = topView.getChildView('content');
		// let mapView = mainView.getChildView('mainbar');
		// let range = mapView.getChildView('date').range;
		// let color = Activity.colors[activity];

		this.showChildView('details', new ActivityView({
			collection: collection,
			nested: true
		}));

		// mainView.showTrends(activity, range, collection, color);
	},

	showActivity: function(activity) {
		switch (activity) {
			case 'awards':
				this.showActivityView(AwardsView, activity);
				break;
			case 'articles':
				this.showActivityView(ArticlesView, activity);
				break;
			case 'book_chapters':
				this.showActivityView(BookChaptersView, activity);
				break;
			case 'books':
				this.showActivityView(BooksView, activity);
				break;
			case 'conference_proceedings':
				this.showActivityView(ConferenceProceedingsView, activity);
				break;
			case 'grants':
				this.showActivityView(GrantsView, activity);
				break;
			case 'patents':
				this.showActivityView(PatentsView, activity);
				break;
			case 'technologies':
				this.showActivityView(TechnologiesView, activity);
				break;
		}
	},

	showSpinner: function() {
		this.$el.find('.nav-tabs .profile .fa-info-circle').hide();
		this.$el.find('.nav-tabs .profile .fa-spinner').show();
	},

	hideSpinner: function() {
		this.$el.find('.nav-tabs .profile .fa-info-circle').show();
		this.$el.find('.nav-tabs .profile .fa-spinner').hide();
	},

	//
	// mouse event handling methods
	//

	onClickTab: function(event) {
		let className = $(event.target).closest('li').attr('class');
		let info = className.replace('tab', '').replace('tooltip-trigger', '').replace('active', '').replace(/-/g, '_').trim();
		
		if (info != this.info) {

			// clear current sidebar view
			//
			this.showChildView('details', new BaseView({
				template: _.template('<div class="message">Loading...</div>')
			}));

			this.showInfo(info);
		}
	},

	onClickClose: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');
		let mapView = mainView.getChildView('mainbar');

		// reset address bar
		//
		AddressBar.clear({
			silent: mainView.options.person == null
		});

		if (mainView.savedPeople && mainView.savedPeople.length > 1) {

			// show group of people from previous search
			//
			mainView.clearSideBar();
			mainView.showPeople(mainView.savedPeople);

			// restore view from before person was clicked
			//
			mapView.popView();

			// restore search bar
			//
			mapView.showSearchBar();
			mapView.hideDateBar();
			mapView.hideActivitiesBar();
		} else {

			// restore search bar to initial state
			//
			mapView.showSearchBar();
			mainView.clearSearch();
		}

		/*
		// clear query string
		//
		window.location.hash = '';

		// close trends view 
		//
		mainView.hideSideBar();

		// deselect selected person
		//
		mapView.deselectAll();
		mapView.peopleView.clearAll();
		mapView.showUnselectedPeople();
		mapView.zoomToPeople();

		// hide activity oriented ui elements
		//
		mapView.hideDateBar();

		// replace this view
		//
		// this.parent.showPeople(mapView.peopleView.collection);
		this.parent.clearSideBar();
		*/
	},

	onClickEditPerson: function() {

		// go to edit my profile view
		//
		Backbone.history.navigate("#my-profile/edit", {
			trigger: true
		});
	},

	onClickReturnToMap: function() {

		// return to map view
		//
		Backbone.history.navigate("", {
			trigger: true
		});
	}
});