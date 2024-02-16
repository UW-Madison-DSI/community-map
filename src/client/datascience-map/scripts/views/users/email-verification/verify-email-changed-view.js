/******************************************************************************\
|                                                                              |
|                          verify-email-changed-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view where users can verify their email                |
|        address modification requests.                                        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<h1>Verify Email Address</h1>
		
		<p>Dear <%= user.getFullName() %>:</p>
		<p>You have recently attempted to change your email address. To change your email address to the account containing this confirmation url, press the button below.
		</p>
		
		<div class="buttons">
			<button id="verify" class="btn btn-primary btn-lg"><i class="fa fa-plus"></i>Verify</button>
		</div>
	`),

	events: {
		'click #verify': 'onClickVerify'
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
		this.model.verify({

			// callbacks
			//
			success: () => {

				// show success notification dialog
				//
				application.showNotifyDialog({
					title: "Success",
					message: "Your new email address has been verified.",

					// callbacks
					//
					accept: () => {

						// go to home view
						//
						Backbone.history.navigate('#home', {
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
	}
});
