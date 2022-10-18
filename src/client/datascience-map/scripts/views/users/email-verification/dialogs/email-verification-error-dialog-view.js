/******************************************************************************\
|                                                                              |
|                     email-verification-error-dialog-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an error dialog that is shown if a user with an          |
|        unverified email address tries to login.                              |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import EmailVerification from '../../../../models/users/email-verification.js';
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
			<h1 id="modal-header-text">Email Verification Error</h1>
		</div>
		
		<div class="modal-body">
			<p>You are attempting to log in to an account with an unverified email address.  When you registered, you should have been sent an email containing a link to verify your email address.   Please take a look through your previous email to see if you received this email (note that it may have been diverted into a spam folder).  If you don't find it, you may click the "Resend" button below to resend it. </p>
		</div>
		
		<div class="modal-footer">
			<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
			<button id="resend" class="btn" data-dismiss="modal"><i class="fa fa-envelope"></i>Resend</button> 
		</div>
	`),

	events: {
		'submit': 'onSubmit',
		'keypress': 'onKeyPress',
		'click #resend': 'onClickResend'
	},

	//
	// event handling methods
	//

	onSubmit: function() {
		if (this.options.accept) {
			this.options.accept();
		}

		// close modal dialog
		//
		this.dialog.hide();

		// disable default form submission
		//
		return false;
	},

	onKeyPress: function(event) {

		// respond to enter key press
		//
		if (event.keyCode === 13) {
			
			// close modal dialog
			//
			this.dialog.hide();

			// perform callback
			//
			this.onSubmit();
		}
	},

	onClickResend: function() {
		let emailVerification = new EmailVerification();
		emailVerification.resend(this.options.username, this.options.password, {

			// callbacks
			//
			success: () => {
				application.showErrorDialog({
					message: "A new verification email has been sent to the email address that you registered with.  Please check your inbox for its arrival.  It make take a few seconds for it to arrive."
				});
			},

			error: () => {
				application.showErrorDialog({
					message: "Could not resend email verification."
				});
			}
		});
	}
});
