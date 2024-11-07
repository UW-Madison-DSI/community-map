/******************************************************************************\
|                                                                              |
|                              email-verification-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the email verification view used in the new              |
|        user registration process.                                            |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<h1>Email Address Verification</h1>
		
		<p>Your account was successfully created. </p>
		<p>However, we need to verify your email address:
			<a href="mailto:<%= email %>"><%= email %></a> . </p>
		<p>Please check your inbox and follow the link in the email that we sent you. </p>
		<br />
		
		<div class="buttons">
			<button id="ok" class="btn btn-primary btn-lg"><i class="fa fa-check"></i>OK</button>
		</div>
	`),

	events: {
		'click #ok': 'onClickOk'
	},

	//
	// event handling methods
	//

	onClickOk: function() {

		// go to welcome view
		//
		Backbone.history.navigate('#', {
			trigger: true
		});
	}
});