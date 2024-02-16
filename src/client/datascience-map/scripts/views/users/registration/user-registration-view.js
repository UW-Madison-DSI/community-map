/******************************************************************************\
|                                                                              |
|                             user-registration-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the introductory view of the application.                |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import User from '../../../models/users/user.js';
import EmailVerification from '../../../models/users/email-verification.js';
import BaseView from '../../../views/base-view.js';
import NewUserProfileFormView from '../../../views/users/registration/forms/new-user-profile-form-view.js';
import EmailVerificationView from '../../../views/users/email-verification/email-verification-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<h1><i class="fa fa-pencil"></i>User Registration Form</h1>
		
		<ol class="breadcrumb">
			<li><a href=""><i class="fa fa-home"></i>Home</a></li>
			<li><a id="aup"><i class="fa fa-file-text"></i>Acceptable Use Policy</a></li>
			<li><i class="fa fa-pencil"></i>User Registration Form</li>
		</ol>
		
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert">
				<i class="fa fa-close"></i>
			</button>
			<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
		</div>
		
		<div id="new-user-profile"></div>
		<br />
		
		<div class="buttons">
			<button id="submit" type="submit" class="btn btn-primary btn-lg"><i class="fa fa-check"></i>Submit</button>
			<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
		</div>
	`),

	regions: {
		form: '#new-user-profile'
	},

	events: {
		'click #aup': 'onClickAup',
		'click .alert .close': 'onClickAlertClose',
		'click #submit': 'onClickSubmit',
		'click #cancel': 'onClickCancel'
	},

	//
	// methods
	//

	initialize: function() {
		this.model = new User({});
	},

	verifyEmail: function() {

		// create a new email verification
		//
		let emailVerification = new EmailVerification({
			user_id: this.model.get('id'),
			email: this.model.get('email')
		});

		// save email verification
		//
		emailVerification.save({
			verify_route: '#register/verify-email'
		}, {

			// callbacks
			//
			success: () => {

				// show email verification view
				//
				application.show(new EmailVerificationView({
					model: this.model
				}));
			},
			error: () => {

				// show error dialog
				//
				application.showErrorDialog({
					message: "Could not save email verification."
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
		this.showChildView('form', new NewUserProfileFormView({
			model: this.model
		}));

		// scroll to top
		//
		let el = this.$el.find('h1');
		el[0].scrollIntoView(true);
	},

	showWarning: function() {
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// dialog rendering methods
	//

	showUserValidationErrorDialog: function(options) {
		import(
			'../../../views/users/registration/dialogs/user-validation-error-dialog-view.js'
		).then((UserValidationErrorDialogView) => {
			application.show(new UserValidationErrorDialogView.default(options))
		});
	},

	//
	// event handling methods
	//

	onClickAup: function() {
		Backbone.history.fragment = null;

		// go to aup view
		//
		Backbone.history.navigate('#register', {
			trigger: true
		});
	},

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickSubmit: function() {

		// check validation
		//
		if (this.getChildView('form').isValid()) {

			// update model from form
			//
			this.model.set(this.getChildView('form').getValues());

			// check to see if model is valid
			//
			let response = this.model.checkValidation(this.model.toJSON(), {

				// callbacks
				//
				success: () => {

					// create new user
					//
					this.model.save(undefined, {

						// callbacks
						//
						success: () => {

							// verify email
							//
							this.verifyEmail();
						},

						error: () => {

							// show error dialog
							//
							application.showErrorDialog({
								message: "Could not create new user."
							});
						}
					});
				},

				error: () => {
					let errors = JSON.parse(response.responseText);

					// show user validation dialog
					//
					this.showUserValidationErrorDialog({
						errors: errors
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

		// go to home view
		//
		Backbone.history.navigate('', {
			trigger: true
		});
	}
});
