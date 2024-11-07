/******************************************************************************\
|                                                                              |
|                         change-password-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for changing the user's password.                 |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ChangePasswordFormView from '../../../../views/users/accounts/forms/change-password-form-view.js';
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
			<h1 id="modal-header-text"><i class="fa fa-lock"></i>Change Password</h1>
		</div>
		
		<div class="modal-body">
			<div class="change-password-form"></div>
		</div>
		
		<div class="modal-footer">
			<button id="submit" class="btn btn-primary"><i class="fa fa-envelope"></i>Submit</button>
			<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button> 
		</div>
	`),

	regions: {
		form: '.change-password-form'
	},

	events: {
		"click #submit": "onClickSubmit"
	},

	//
	// constructor
	//

	initialize: function() {
		this.model = application.session.user;
	},

	//
	// methods
	//

	changePassword: function(currentPassword, newPassword) {

		// change current user's password
		//
		this.model.changePassword(currentPassword, newPassword, {

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

						// return to my account view
						//
						Backbone.history.navigate("#home", {
							trigger: true
						});
					}
				});
			},

			error: (response) => {

				// show error dialog
				//
				application.showErrorDialog({
					message: "Could not save password changes: " + response.responseText
				});
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showChildView('form', new ChangePasswordFormView({
			model: this.model
		}));
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
			let values = this.getChildView('form').getValues();
			this.changePassword(values.current_password, values.new_password);
		}
	}
});
