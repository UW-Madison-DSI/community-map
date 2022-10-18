/******************************************************************************\
|                                                                              |
|                             change-my-password-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for changing the user's password.                 |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import NewPasswordFormView from '../../../views/users/authentication/forms/new-password-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<h1>Reset Password</h1>
	
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert">
				<i class="fa fa-close"></i>
			</button>
			<label>Error: </label><span class="message">Please try again.</span>
		</div>
	
		<p>Please enter and confirm your new password:</p>
		<br />

		<div class="form"></div>
		
		<div class="buttons">
			<button id="submit" class="btn btn-primary btn-lg"><i class="fa fa-check"></i>Submit</button>
			<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
		</div>
	`),

	regions: {
		form: {
			el: '.form',
			replaceElement: true
		}
	},

	events: {
		'click #submit': 'onClickSubmit',
		'click #cancel': 'onClickCancel'
	},

	//
	// rendering methods
	//
	
	onRender: function() {

		// show child views
		//
		this.showChildView('form', new NewPasswordFormView());
	},

	showWarning: function() {
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// event handling methods
	//

	onClickSubmit: function() {

		// check validation
		//
		if (this.getChildView('form').isValid()) {

			// get values from form
			//
			let password = this.getChildView('form').getValue('password');

			// change password
			//
			this.model.reset(password, {

				// callbacks
				//
				success: () => {

					// show success notification dialog
					//
					application.showNotifyDialog({
						title: "My Password Changed",
						message: "Your user password has been successfully changed.",

						// callbacks
						//
						accept: () => {

							// go home
							//
							Backbone.history.navigate('#home', {
								trigger: true
							});
							window.location.reload();
						}
					});
				},

				error: () => {

					// show error dialog
					//
					application.showErrorDialog({
						message: "Error removing pending password reset."
					});
				}	
			});
		} else {

			// display error message
			//
			this.showWarning();
		}
	},

	onClickCancel: function() {

		// go home
		//
		Backbone.history.navigate('#home', {
			trigger: true
		});
		window.location.reload();
	}
});
