/******************************************************************************\
|                                                                              |
|                              sign-in-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view used for user authentication.                |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`

		<% if (config.sso && config.non_sso) { %>
		<div class="form-group" id="sign-in-with">
			<label class="control-label">Sign In With</label>
			<div class="controls">
				<div class="input-group">
					<div class="radio-inline">
						<label><input type="radio" name="sign-in-with" value="netid" checked>UW NetID</label>
					</div>
					<div class="radio-inline">
						<label><input type="radio" name="sign-in-with" value="username">Username</label>
					</div>

					<% if (defaults.messages && defaults.messages.sign_in_with) { %>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Sign In With" data-content="<%= defaults.messages.sign_in_with %>" style="margin-left:10px"></i>
					<% } %>
				</div>
			</div>
		</div>
		<% } %>

		<div class="form-group" id="username"<% if (config.sso && config.non_sso) { %>style="display:none"<% } %>>
			<label class="control-label">Username</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" spellcheck="false">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="This is the username that you specified when you registered."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-group" id="password"<% if (config.sso && config.non_sso) { %>style="display:none"<% } %>>
			<label class="control-label">Password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="form-control" maxlength="200">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Password" data-content="This is the password that you specified when you registered."></i>
					</div>
				</div>
			</div>
		</div>
		</div>
		
		<div class="alert alert-warning" style="display:none">
		<button type="button" class="close" data-dismiss="alert">
			<i class="fa fa-close"></i>
		</button>
		<label>Error: </label><span class="message">User name and password are not correct.  Please try again.</span>
		</div>

		<hr>

		<div class="row">
			<div id="requests" class="col-sm-4">
				<a id="reset-password" class="fineprint"<% if (config.sso && config.non_sso) { %>style="display:none"<% } %>>Reset my password</a>
				<br />
				<a id="request-username" class="fineprint"<% if (config.sso && config.non_sso) { %>style="display:none"<% } %>>Request my username</a>
				<br /><br />
			</div>
			<div class="col-sm-8" style="margin:auto">
				<div class="well" style="margin-bottom:0">
					No Account?
					<a id="register">Add yourself to the map!</a>
				</div>
			</div>
		</div>
	`),

	events: {
		'click .alert .close': 'onClickAlertClose',
		'click #sign-in-with input': 'onClickSignInWith',
		'click #reset-password': 'onClickResetPassword',
		'click #request-username': 'onClickRequestUsername',
		'click #register': 'onClickRegister'
	},

	//
	// form methods
	//

	getValue: function(key) {
		switch (key) {
			case 'sign_in_with':
				return this.$el.find('#sign-in-with input:checked').val();
			case 'username':
				return this.$el.find('#username input').val();
			case 'password':
				return this.$el.find('#password input').val();
		}
	},

	getValues: function() {
		return {
			username: this.getValue('username'),
			password: this.getValue('password')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'sign_in_with':
				switch (value) {
					case 'netid':
						this.$el.find('#username').hide();
						this.$el.find('#password').hide();
						this.$el.find('#reset-password').hide();
						this.$el.find('#request-username').hide();
						break;
					case 'username':
						this.$el.find('#username').show();
						this.$el.find('#password').show();
						this.$el.find('#reset-password').show();
						this.$el.find('#request-username').show();
						break;
			}
		}
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

	showWarning: function(message) {
		this.$el.find('.alert-warning .message').html(message);
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// methods
	//

	submit: function(options) {
		let values = this.getValues();

		// send login request
		//
		application.session.login(values.username, values.password, {
			crossDomain: true,
			
			// callbacks
			//
			success: (data) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(data);
				}
			},

			error: (response) => {
				if (response.status == 403) {
					window.location = application.getURL() + 'block/index.html';
				} else {
					if (response.responseText == "User email has not been verified.") {
						this.showEmailVerificationErrorDialog(values);
					} else if (response.responseText == '') {
						this.showWarning("Log in request failed. It appears that you may have lost internet connectivity.  Please check your internet connection and try again.");
					} else {
						this.showWarning(response.responseText);
					}
				}
			}
		});
	},

	//
	// dialog rendering methods
	//

	showResetPasswordDialog: function() {
		import(
			'../../../../views/users/reset-password/dialogs/reset-password-dialog-view.js'
		).then((ResetPasswordDialogView) => {
			application.show(new ResetPasswordDialogView.default({
				parent: this
			}));
		});
	},

	showRequestUsernameDialog: function() {
		import(
			'../../../../views/users/request-username/dialogs/request-username-dialog-view.js'
		).then((RequestUsernameDialogView) => {
			application.show(new RequestUsernameDialogView.default({
				parent: this
			}));
		});
	},

	showEmailVerificationErrorDialog: function(options) {
		import(
			'../../../../views/users/email-verification/dialogs/email-verification-error-dialog-view.js'
		).then((EmailVerificationErrorDialogView) => {
			application.show(new EmailVerificationErrorDialogView.default(options));
		});
	},

	//
	// event handling methods
	//

	onClickSignInWith: function() {
		this.setValue('sign_in_with', this.getValue('sign_in_with'));
	},

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickResetPassword: function() {
		this.showResetPasswordDialog();
		this.parent.close();
	},

	onClickRequestUsername: function() {
		this.showRequestUsernameDialog();
		this.parent.close();
	},

	onClickRegister: function() {
		this.parent.close();

		// go to welcome view
		//
		Backbone.history.navigate('#register', {
			trigger: true
		});
	}
});