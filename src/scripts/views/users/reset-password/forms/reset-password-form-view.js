/******************************************************************************\
|                                                                              |
|                          reset-password-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form that is used to reset a password.                 |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="form-group">
			<label class="control-label">Username</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" id="username">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="This is the username that you specified when you registered."></i>
					</div>
				</div>
			</div>
		</div>

		<p class="separator">Or</p>

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
	`),

	events: {
		'click #username': 'onClickUsername',
		'blur #username': 'onBlurUsername',
		'click #email-address': 'onClickEmailAddress',
		'blur #email-address': 'onBlurEmailAddress'
	},

	//
	// getting methods
	//

	getUsername: function() {
		return this.$el.find('#username').val();
	},

	getEmail: function() {
		return this.$el.find('#email-address').val();
	},

	//
	// mouse event handling methods
	//

	onClickUsername: function() {

		// disable email address input
		//
		this.$el.find('#email-address').attr('disabled', 'true');
	},

	onBlurUsername: function() {
		if (this.$el.find('#username').val() !== '') {

			// disable email address input
			//
			this.$el.find('#email-address').attr('disabled', 'true');
		} else {

			// enable email address input
			//
			this.$el.find('#email-address').removeAttr('disabled');
		}
	},

	onClickEmailAddress: function() {

		// disable user name input
		//
		this.$el.find('#username').attr('disabled', 'true');
	},

	onBlurEmailAddress: function() {
		if (this.$el.find('#email-address').val() !== '') {

			// disable email address input
			//
			this.$el.find('#username').attr('disabled', 'true');
		} else {

			// enable email address input
			//
			this.$el.find('#username').removeAttr('disabled');
		}
	}
});
