/******************************************************************************\
|                                                                              |
|                             sign-in-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        modal sign in dialog box.                                             |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import User from '../../../../models/users/user.js';
import DialogView from '../../../../views/dialogs/dialog-view.js';
import SignInFormView from '../../../../views/users/authentication/forms/sign-in-form-view.js';

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
				<i class="fa fa-sign-in-alt"></i>
				Sign In
			</h1>
		</div>
		
		<div class="modal-body">
		</div>
		
		<div class="modal-footer">
			<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button>
			<button id="ok" class="btn btn-primary"><i class="fa fa-check"></i>OK</button>
		</div>
	`),

	regions: {
		form: '.modal-body'
	},

	events: {
		'click #ok': 'onClickOk',
		'click .alert .close': 'onClickAlertClose',
		'keydown': 'onKeyDown'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showChildView('form', new SignInFormView());
	},

	//
	// methods
	//

	showHome: function() {

		// remove event handlers
		//
		this.undelegateEvents();

		// go to home view
		//
		Backbone.history.navigate('#home', {
			trigger: true
		});
	},

	//
	// event handling methods
	//

	onSignIn: function() {
		
		// check if first time sign-in
		//
		if (!application.session.user.hasLoggedIn()) {
			if (defaults.welcome) {
				application.showNotifyDialog(defaults.welcome);
			}
		}

		// get user information
		//
		application.session.getUser({

			// callbacks
			//
			success: (user) => {
				application.session.user = user;
				this.showHome();
			}
		});

		// close modal dialog
		//
		this.hide();
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {
		this.getChildView('form').submit({

			// callbacks
			//
			success: (data) => {
				application.session.user = new User(data);
				this.onSignIn();
			}
		});
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// respond to enter key press
		//
		if (event.keyCode === 13) {
			this.onClickOk();
		}
	}
});
