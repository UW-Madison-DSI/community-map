/******************************************************************************\
|                                                                              |
|                                     user.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an application user.                          |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Timestamped from '../../models/utilities/timestamped.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {

		// name
		//
		'first_name': undefined,
		'middle_name': undefined,
		'last_name': undefined,

		// account
		//
		'username': undefined,
		'password': undefined,
		'email': undefined,
		'options': undefined
	},

	//
	// Backbone attributes
	//

	idAttribute: 'id',
	urlRoot: config.servers.community_map + '/users',

	//
	// querying methods
	//

	isOwnerOf: function(project) {
		return this.get('user_uid') ===  project.get('projectOwnerUid');
	},

	isVerified: function() {
		return this.get('email_verified_flag') == 1;
	},

	isPending: function() {
		return this.get('email_verified_flag') == 0;
	},

	isEnabled: function() {
		return this.get('enabled_flag') == 1;
	},

	isDisabled: function() {
		return this.get('enabled_flag') == 0;
	},

	isSameAs: function(user) {
		return user && this.get('user_uid') == user.get('user_uid');
	},

	isCurrent: function() {
		return this.isSameAs(application.session.user);
	},

	isAdmin: function() {
		return this.get('is_admin');
	},

	hasName: function() {
		return this.has('first_name') || this.has('last_name');
	},

	hasFullName: function() {
		return this.has('first_name') && this.has('last_name');
	},

	hasSshAccess: function() {
		return this.get('ssh_access_flag') == '1';
	},

	hasLoggedIn: function() {
		return this.has('last_login');
	},

	//
	// getting methods
	//

	getName: function() {
		let names = [];
		if (this.has('first_name')) {
			names.push(this.get('first_name'));
		}
		if (this.has('middle_name')) {
			names.push(this.get('middle_name'));
		}
		if (this.has('last_name')) {
			names.push(this.get('last_name'));
		}
		return names.join(' ');
	},

	getFullName: function() {
		return this.hasName()? this.get('first_name') + ' ' + this.get('last_name') : '';
	},

	getUrl: function() {
		return '#users/' + this.get('id');
	},

	getStatus: function() {
		let status;
		if (this.isPending()) {
			status = 'pending';
		} else if (this.isEnabled()) {
			status = 'enabled';
		} else {
			status = 'disabled';
		}
		return status;
	},

	//
	// setting methods
	//

	setStatus: function(status) {
		switch (status) {
			case 'pending':
				this.set({
					'enabled_flag': 0
				});
				break;
			case 'enabled':
				this.set({
					'enabled_flag': 1,
					'email_verified_flag': 1
				});
				break;
			case 'disabled':
				this.set({
					'enabled_flag': 0
				});
				break;
		}
	},

	setOwnerStatus: function(status) {
		switch (status) {
			case 'pending':
				this.set({
					'owner': 'pending'
				});
				break;
			case 'approved':
				this.set({
					'owner': 'approved'
				});
				break;
			case 'denied':
				this.set({
					'owner': 'denied'
				});
				break;
		}
	},

	setAdmin: function(isAdmin) {
		this.set({
			'is_admin': isAdmin
		});
	},

	//
	// ajax methods
	//

	requestUsernameByEmail: function(email, options) {
		$.ajax(_.extend({
			url: this.urlRoot + '/email/request-username',
			type: 'POST',
			dataType: 'JSON',
			data: {
				'email': email
			},

			// callbacks
			//
			success: (data) => {
				this.set(this.parse(data));
			}
		}, options));
	},

	checkValidation: function(data, options) {
		return $.ajax(_.extend(options, {
			url: this.urlRoot + '/accounts/validate',
			type: 'POST',
			dataType: 'json',
			data: data
		}));
	},

	changePassword: function(oldPassword, newPassword, options) {
		$.ajax(_.extend(options, {
			url: this.urlRoot + '/' + this.get('id') + '/change-password',
			type: 'PUT',
			data: {
				'old_password': oldPassword,
				'new_password': newPassword,
				'password_reset_key': options.password_reset_key,
				'password_reset_id': options.password_reset_id
			}
		}));
	},

	resetPassword: function(password, options) {
		$.ajax(_.extend(options, {
			url: config.servers.community_map + '/password-resets/' + options.password_reset_id + '/reset',
			type: 'PUT',
			data: {
				'password': password,
				'password_reset_key': options.password_reset_key,
				'password_reset_id': options.password_reset_id
			}
		}));
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.last_login) {
			data.last_login = new Date(data.last_login);
		}

		return data;
	}
});
