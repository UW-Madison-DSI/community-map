/******************************************************************************\
|                                                                              |
|                      editable-user-profile-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of the user's profile              |
|        information.                                                          |
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
		<fieldset>
			<legend>Personal info</legend>

			<div class="form-group" id="name">
				<label class="required control-label">Name</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required form-control" name="name" value="<%= name %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Name" data-content="This is the name that you choose to be called by."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>

		<div align="right">
			<label><span class="required"></span>Fields are required</label>
		</div>
	`),

	messages: {
		'name': {
			required: "Enter your name"
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.getName()
		};
	},

	//
	// form methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('#name input').val();
		}
	},

	getValues: function() {
		let name = this.getValue('name');
		let names = name.split(' ');

		if (names.length == 1) {
			return {
				last_name: names[length]
			};
		} else if (names.length == 2) {
			return {
				first_name: names[0],
				last_name: names[1]
			}
		} else {
			return {
				first_name: names[0],
				middle_name: names.slice(1, -1).join(' '),
				last_name: names[names.length - 1]
			}
		}
	}
});
