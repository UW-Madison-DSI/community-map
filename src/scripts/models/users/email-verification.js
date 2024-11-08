/******************************************************************************\
|                                                                              |
|                              email-verification.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of user account email verification.              |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Timestamped from '../../models/utilities/timestamped.js';

export default Timestamped.extend({

	//
	// Backbone attributes
	//

	urlRoot: config.servers.community_map + '/verifications',

	//
	// ajax methods
	//

	verify: function(options) {
		$.ajax(_.extend(options, {
			url: this.urlRoot + '/' + this.get('id') + '/verify',
			type: 'PUT'
		}));
	},

	resend: function(username, password, options) {
		$.ajax(_.extend(options, {
			url: this.urlRoot + '/resend',
			type: 'POST',
			data: {
				'username': username,
				'password': password
			}
		}));
	}
});