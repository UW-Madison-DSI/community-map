/******************************************************************************\
|                                                                              |
|                          change-password-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for changing the user's password.                 |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';
import '../../../../utilities/security/password-policy.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert">
				<i class="fa fa-close"></i>
			</button>
			<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
		</div>
		
		<div class="form-group">
			<label class="required control-label">Current password</label>
			<div class="col-sm-6 col-xs-12">
				<div class="input-group">
					<input type="password" class="required form-control" autocomplete="off" id="current-password" maxlength="200" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Current password" data-content="Your current password that you would like to change."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-group">
			<label class="required control-label">New password</label>
			<div class="col-sm-6 col-xs-12">
				<div class="input-group">
					<input type="password" class="required form-control" autocomplete="off" name="password" id="new-password" maxlength="200" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="New password" data-content="Passwords must be at least 9 characters long including one uppercase letter, one lowercase letter, one number, and one symbol. Passwords at least 10 characters long must include one uppercase letter, one lowercase letter, and one number. Symbols are encouraged. Maximum length is 200 characters ( additonal characters will be truncated. )"></i>
					</div>
				</div>
				<div class="password-meter" style="display:none">
					<label class="password-meter-message"></label>
					<div class="password-meter-bg">
						<div class="password-meter-bar"></div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-group">
			<label class="required control-label">Confirm new password</label>
			<div class="col-sm-6 col-xs-12">
				<div class="input-group">
					<input type="password" class="form-control" autocomplete="off" name="confirm-password" id="confirm-password" maxlength="200" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm new password" data-content="Please retype your password exactly as you first entered it."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div align="right">
			<label><span class="required"></span>Fields are required</label>
		</div>
	`),

	events: {
		"click .alert .close": "onClickAlertClose",
		"keydown #password": "onKeydownPassword"
	},

	rules: {
		"password": {
			required: true,
			passwordStrongEnough: true
		},
		"confirm-password": {
			required: true,
			equalTo: "#new-password"
		}
	},

	messages: {
		"password": {
			required: "Enter a password."
		},
		"confirm-password": {
			required: "Re-enter your password.",
			equalTo: "Enter the same password as above."
		}
	},

	//
	// construtor
	//

	initialize: function() {
		this.model = application.session.user;
		
		// add password validation rule
		//
		$.validator.addMethod("passwordStrongEnough", (value) => {
			let username = this.$el.find("#username").val();
			let passwordRating = $.validator.passwordRating(value, username);
			return (passwordRating.messageKey === "strong");
		}, "Your password must be stronger.");
	},

	//
	// form methods
	//

	isValid: function() {

		// confirm password spelling
		//
		let values = this.getValues();
		if (values.new_password !== values.confirm_password) {
			this.showWarning("Passwords do not match.");
			return false;
		}

		let valid = FormView.prototype.isValid.call(this);

		// display error message
		//
		if (!valid) {
			this.showWarning();
			return false;
		}

		return true;
	},

	getValues: function() {
		return {
			'current_password': this.$el.find("#current-password").val(),
			'new_password': this.$el.find("#new-password").val(),
			'confirm_password': this.$el.find("#confirm-password").val()
		};
	},

	//
	// rendering methods
	//

	showWarning: function() {
		this.$el.find(".alert-warning").show();
	},

	hideWarning: function() {
		this.$el.find(".alert-warning").hide();
	},

	//
	// event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},
	
	onKeydownPassword: function(event) {
		let maxlength = $(event.currentTarget).attr("maxlength");
		if (maxlength) {
			let length = event.currentTarget.value.length;
			if (length >= maxlength) {

				// show notify dialog
				//
				application.showNotifyDialog({
					message: "Your password may not exceed " + maxlength + " characters in length."
				});
			}
		}
	}
});
