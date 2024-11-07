/******************************************************************************\
|                                                                              |
|                       request-username-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog box that is used to request a username.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import User from '../../../../models/users/user.js';
import DialogView from '../../../../views/dialogs/dialog-view.js';

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
				<i class="fa fa-envelope"></i>
				Request Username
			</h1>
		</div>
		
		<div class="modal-body">
			<p>Please enter your email address below.  By clicking the request username button, your username will be sent via email to the account you supplied provided you are a registered user.  If you are not already a user, please register via the sign up link on the welcome page. </p>
			<br />

			<form class="form-horizontal">
				<div class="form-group">
					<label class="control-label">Email address</label>
					<div class="controls">
						<div class="input-group">
							<input type="text" class="form-control" id="email-address">
							<div class="input-group-addon">
								<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Email address" data-content="This is the email address that you specified when you registered."></i>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
		
		<div class="modal-footer">
			<button id="request-username" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-envelope"></i>Request Username</button>
			<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button> 
		</div>
	`),

	events: {
		'click #request-username': 'onClickRequestUsername',
		'click #cancel': 'onClickCancel',
		'keydown': 'onKeyDown'
	},

	//
	// methods
	//

	requestUsernameByEmail: function(email) {

		// find user by username
		//
		new User().requestUsernameByEmail(email, {

			// callbacks
			//
			success: () => {
				application.showNotifyDialog({
					title: "Email Sent",
					message: "If the email address you submitted matches a valid account, an email containing your username will be sent."
				});
			},
	
			error: (jqXHR) => {
				application.showErrorDialog({
					message: jqXHR.responseText
				});
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// display popovers on hover
		//
		this.$el.find('[data-toggle="popover"]').popover({
			trigger: 'hover'
		});
	},

	//
	// mouse event handling methods
	//

	onClickRequestUsername: function() {
		let email = this.$el.find('#email-address').val();

		if (email) {
			this.requestUsernameByEmail(email);
		} else {

			// show notification dialog
			//
			application.showNotifyDialog({
				message: "You must supply a username or email address."
			});
		}

		if (this.options.accept) {
			this.options.accept();
		}

		// close modal dialog
		//
		this.hide();

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

	onKeyPress: function(event) {

		// respond to enter key press
		//
		if (event.keyCode === 13) {
			this.onClickResetPassword();

			// close modal dialog
			//
			this.dialog.hide();
		}
	}
});
