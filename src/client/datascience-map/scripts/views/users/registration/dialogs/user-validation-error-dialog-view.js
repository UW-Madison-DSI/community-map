/******************************************************************************\
|                                                                              |
|                      user-validation-error-dialog-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an error dialog that is shown if a user tries to         |
|        to register a new user with invalid fields.                           |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

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
			<h1 id="modal-header-text">User Validation Error</h1>
		</div>
		
		<div class="modal-body">
			<p>This user profile is not valid for the following reasons: </p>
			<ul>
			<% for (let i = 0; i < errors.length; i++) { %>
				<li><%= errors[i].replace('"', "&quot") %></li>
			<% } %>
			</ul>
			<p>Please correct the form and resubmit. </p>
		</div>
		
		<div class="modal-footer">
			<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
		</div>
	`),

	events: {
		'submit': 'onSubmit',
		'keypress': 'onKeyPress'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: this.options.title,
			errors: this.options.errors
		};
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
	}
});
