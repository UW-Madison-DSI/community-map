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

			<div class="form-group" id="first-name">
				<label class="required control-label">First name</label>
				<div class="col-sm-6 col-xs-12">
					<div class="input-group">
						<input type="text" class="required form-control" name="first-name" value="<%= first_name %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="First name" data-content="This is the informal name or given name that you are called by."></i>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group" id="middle-name">
				<label class="control-label">Middle name</label>
				<div class="col-sm-6 col-xs-12">
					<div class="input-group">
						<input type="text" class="form-control" name="middle-name" value="<%= middle_name %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Middle name" data-content="This is your middle name (or names)."></i>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group" id="last-name">
				<label class="required control-label">Last name</label>
				<div class="col-sm-6 col-xs-12">
					<div class="input-group">
						<input type="text" class="required form-control" name="last-name" value="<%= last_name %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Last name" data-content="This is your family name or surname."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>

		<div align="right">
			<label><span class="required"></span>Fields are required</label>
		</div>
	`),

	regions: {
		selector: '#country-selector'
	},

	messages: {
		'first-name': {
			required: "Enter your given / first name"
		},
		'middle-name': {
			required: "Enter your middle name (or names)"
		},
		'last-name': {
			required: "Enter your family / last name"
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model
		};
	},

	//
	// form methods
	//

	getValue: function(key) {
		switch (key) {
			case 'first_name':
				return this.$el.find('#first-name input').val();
			case 'middle_name':
				return this.$el.find('#middle-name input').val();
			case 'last_name':
				return this.$el.find('#last-name input').val();
		}
	},

	getValues: function() {
		return {
			first_name: this.getValue('first_name'),
			middle_name: this.getValue('middle_name'),
			last_name: this.getValue('last_name')
		};
	}
});
