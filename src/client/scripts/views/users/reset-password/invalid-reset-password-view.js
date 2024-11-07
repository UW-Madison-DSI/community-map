/******************************************************************************\
|                                                                              |
|                            invalid-reset-password-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for resetting the user's password.                |
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
		<h1>Invalid Password Reset</h1>
		<p>This password reset is invalid.  Please request another password reset.</p>
		
		<div class="bottom buttons">
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

		// go to home view
		//
		Backbone.history.navigate('', {
			trigger: true
		});
	}
});