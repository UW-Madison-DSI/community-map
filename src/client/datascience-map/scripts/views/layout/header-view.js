/******************************************************************************\
|                                                                              |
|                                 header-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application header and associated content.           |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="navbar navbar-default navbar-fixed-top navbar-inverse">
			<div class="container">

				<a id="brand" href="#" id="brand" class="active navbar-brand">
					<img class="logo" src="<%= defaults.navbar.icon %>" />
					<%= defaults.navbar.title %>
				</a>

				<% if (defaults.navbar.navs) { %>
				<ul class="nav navbar-nav">
					<% let keys = Object.keys(defaults.navbar.navs); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<% let item = defaults.navbar.navs[key]; %>
					<li class="<%= key %><% if (nav == key) {%> active <% } %>">
						<a href="<%= item.href %>">
							<i class="<%= item.icon %>"></i>
							<span class="hidden-xs"><%= item.text %></span>
						</a>
					</li>
					<% } %>
				</ul>
				<% } %>

				<ul class="title-bar nav navbar-nav hidden-xs">
					<li class="hidden-sm hidden-xs">
						<a href="http://www.wisc.edu" target="_blank" style="padding:0">
							<span style="color:white;line-height:40px">UNIVERSITY OF WISCONSIN-MADISON</span>
						</a>
					</li>
				</ul>
	
				<ul class="nav navbar-nav navbar-right">
					<% if (user) { %>
					<li <% if (nav == 'home') {%> class="active" <% } %>>
						<a id="home">
							<i class="fa fa-user"></i>
							<span class="hidden-xs"><%= user.get('username') %></span>
						</a>
					</li>
					<button id="sign-out" class="btn btn-primary">
						<i class="fa fa-sign-out-alt"></i>
						<span>Sign Out</span>
					</button>	
					<% } else { %>
					<button id="sign-in" class="btn btn-primary">
						<i class="fa fa-sign-in-alt"></i>
						<span class="hidden-xs">Sign In</span>
					</button>
					<button id="sign-up" class="btn">
						<i class="fa fa-user-plus"></i>
						<span class="hidden-xs">Add Me</span>
					</button>
					<% } %>
				</ul>
			</div>
		</div>
	`),

	events: {
		'click #brand': 'onClickBrand',
		'click #map': 'onClickMap',
		'click #about': 'onClickAbout',
		'click #contact': 'onClickContact',
		'click #help': 'onClickHelp',
		'click #home': 'onClickHome',
		'click #sign-in': 'onClickSignIn',
		'click #sign-up': 'onClickSignUp',
		'click #sign-out': 'onClickSignOut'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			nav: this.options.nav,
			user: application.session.user
		};
	},

	//
	// event handling methods
	//

	onClickBrand: function() {

		// go to welcome view
		//
		Backbone.history.navigate('#', {
			trigger: true
		});
	},

	onClickMap: function() {
		Backbone.history.navigate('#', {
			trigger: true
		});
	},

	onClickAbout: function() {
		Backbone.history.navigate('#about', {
			trigger: true
		});
	},

	onClickContact: function() {
		Backbone.history.navigate('#contact', {
			trigger: true
		});
	},

	onClickHelp: function() {
		Backbone.history.navigate('#help', {
			trigger: true
		});
	},

	onClickHome: function() {
		Backbone.history.navigate('#home', {
			trigger: true
		});
	},

	onClickSignIn: function() {
		import(
			'../../views/users/authentication/dialogs/sign-in-dialog-view.js'
		).then((SignInDialogView) => {

			// show sign in dialog
			//
			application.show(new SignInDialogView.default());
		});
	},

	onClickSignUp: function() {
		Backbone.history.navigate('#register', {
			trigger: true
		});
	},

	onClickSignOut: function() {
		application.logout();
	}
});
