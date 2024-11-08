/******************************************************************************\
|                                                                              |
|                              verify-email-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view where users can verify their email                |
|        address in order to activate their accounts.                          |
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
		<h1>Verify Email Address</h1>
		
		<p>Dear <%= user.getFullName() %>:</p>
		<p>To complete your registration, press the button below.  Once you have done this, you may log in.
		</p>
		
		<div class="buttons">
			<button id="verify" class="btn btn-primary btn-lg"><i class="fa fa-plus"></i>Verify</button>
		</div>
	`),

	events: {
		'click #verify': 'onClickVerify'
	},

	//
	// methods
	//

	verify: function() {
		this.model.verify({

			// callbacks
			//
			success: () => {

				// show success notification dialog
				//
				application.showNotifyDialog({
					title: "Success",
					message: "Your email address has been verified.  You may now log in to the application.",

					// callbacks
					//
					accept: () => {

						// go to home view
						//
						Backbone.history.navigate('#', {
							trigger: true
						});
					}
				});
			},

			error: (response) => {

				// show error dialog
				//
				application.showErrorDialog({
					message: response.responseText
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			user: this.options.user
		};
	},

	//
	// event handling methods
	//

	onClickVerify: function() {

		// verify email
		//
		this.verify();
	}
});
