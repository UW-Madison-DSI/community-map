/******************************************************************************\
|                                                                              |
|                         reset-password-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog box that is used to reset a password.          |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import PasswordReset from '../../../../models/users/password-reset.js';
import DialogView from '../../../../views/dialogs/dialog-view.js';
import ResetPasswordFormView from '../../../../views/users/reset-password/forms/reset-password-form-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
				<i class="fa fa-close"></i>
			</button>
			<h1 id="modal-header-text">
				<i class="fa fa-repeat"></i>
				Reset Password
			</h1>
		</div>
		
		<div class="modal-body">
			<p><% if (show_user) { %>Please enter your username or email address below. <% } %>After clicking the Request Reset button an email will be sent to your registered email address containing a link to reset your password.</p>
			<br />
		
			<% if (show_user) { %><div class="form"></div><% } %>
		</div>
		
		<div class="modal-footer">
			<button id="reset-password" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-envelope"></i>Request Reset</button>
			<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button> 
		</div>
	`),

	regions: {
		form: {
			el: '.form',
			replaceElement: true
		}
	},

	events: {
		'click #reset-password': 'onClickResetPassword',
		'click #cancel': 'onClickCancel',
		'keydown': 'onKeyDown'
	},

	//
	// methods
	//

	resetPassword: function(data) {
		new PasswordReset().save(data, {

			// callbacks
			//
			success: () => {

				// show success notification view
				//
				if (this.options.username) {
					application.showNotifyDialog({
						title: "Reset Password",
						message: "Please check your inbox for an email with a link that you may use to reset your password."
					});
				} else {
					application.showNotifyDialog({
						title: "Reset Password",
						message: "If you supplied a valid username or email address you will be sent an email with a link that you may use to reset your password."
					});
				}
			},

			error: () => {

				// show error dialog
				//
				application.showErrorDialog({
					message: "Your password could not be reset."
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			show_user: this.options.username == undefined
		};
	},

	onRender: function() {
		this.showChildView('form', new ResetPasswordFormView());
	},

	//
	// mouse event handling methods
	//

	onClickResetPassword: function() {
		let username;

		// get username from options or form
		//
		if (this.options.username) {
			username = this.options.username;
		} else {
			username = this.getChildView('form').getUsername();
		}

		// reset password by username or email
		//
		if (username) {
			this.resetPassword({
				'username': username
			});
		} else {
			let email = this.getChildView('form').getEmail();
			if (email) {
				this.resetPassword({
					'email': email
				});
			} else {

				// show notification dialog
				//
				application.showNotifyDialog({
					message: "You must supply a user name or email address."
				});
			}
		}

		if (this.options.accept){
			this.options.accept();
		}

		// close dialog
		//
		this.destroy();

		// disable default form submission
		//
		return false;
	},

	onClickCancel: function() {
		if (this.options.reject) {
			this.options.reject();
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// respond to enter key press
		//
		if (event.keyCode === 13) {
			this.onClickResetPassword();
		}
	}
});
