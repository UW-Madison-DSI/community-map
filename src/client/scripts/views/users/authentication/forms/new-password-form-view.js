/******************************************************************************\
|                                                                              |
|                          new-password-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view for changing the user's password.            |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';
import '../../../../views/forms/validation/alphanumeric-rules.js';
import '../../../../views/forms/validation/authentication-rules.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<fieldset>
			<div class="form-group" id="password">
				<label class="required control-label">Password</label>
				<div class="controls">
					<div class="input-group">
						<input type="password" class="form-control" autocomplete="off" name="password" maxlength="200">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Password" data-content="Passwords must be at least 8 characters long including one uppercase letter, one lowercase letter and one number or symbol."></i>
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

			<div class="form-group" id="confirm-password">
				<label class="required control-label">Confirm password</label>
				<div class="controls">
					<div class="input-group">
						<input type="password" class="required form-control" autocomplete="off" name="confirm-password" maxlength="200">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm password" data-content="Please retype your password exactly as you first entered it."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>

		<div align="right">
			<label><span class="required"></span>Fields are required</label>
		</div>
	`),

	rules: {

		// account rules
		//
		'password': {
			required: true,
			passwordStrongEnough: "Your password must be stronger."
		},
		'confirm-password': {
			required: true,
			equalTo: '#password input'
		}
	},

	messages: {

		// account info
		//
		'confirm-password': {
			required: "Re-enter your password.",
			equalTo: "Enter the same password as above."
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'password':
				return this.$el.find('#password input').val();
			case 'confirm_password':
				return this.$el.find('#confirm-password input').val();
		}
	}
});