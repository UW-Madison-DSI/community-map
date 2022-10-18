/******************************************************************************\
|                                                                              |
|                          user-profile-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a read-only view of the user's profile information.      |
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
			<legend>Profile info</legend>
	
			<div class="form-group">
				<label class="form-label">First name</label>
				<div class="col-sm-6 col-xs-12">
					<%= first_name %>
				</div>
			</div>

			<div class="form-group">
				<label class="form-label">Middle name</label>
				<div class="col-sm-6 col-xs-12">
					<%= middle_name %>
				</div>
			</div>

			<div class="form-group">
				<label class="form-label">Last name</label>
				<div class="col-sm-6 col-xs-12">
					<%= last_name %>
				</div>
			</div>
		</fieldset>
	
		<fieldset>
			<legend>Account info</legend>	
	
			<div class="form-group">
				<label class="form-label">Username</label>
				<div class="col-sm-6 col-xs-12">
					<%= username %>
				</div>
			</div>

			<div class="form-group">
				<label class="form-label">Email address</label>
				<div class="col-sm-6 col-xs-12">
					<a href="mailto:<%= email %>"><%= email %></a>
				</div>
			</div>
		</fieldset>

		<% if (create_date || update_date) { %>
		<fieldset>
			<legend>Dates</legend>
	
			<% if (model.hasCreateDate()) { %>
			<div class="form-group">
				<label class="form-label">Creation date</label>
				<div class="col-sm-6 col-xs-12">
					<%= create_date %>
				</div>
			</div>
			<% } %>
	
			<% if (model.hasUpdateDate()) { %>
			<div class="form-group">
				<label class="form-label">Last modified date</label>
				<div class="col-sm-6 col-xs-12">
					<%= update_date %>
				</div>
			</div>
			<% } %>
		</fieldset>
		<% } %>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model,
			create_date: this.model.hasCreateDate()? this.model.getCreateDate() : undefined,
			update_date: this.model.hasUpdateDate()? this.model.getUpdateDate() : undefined
		};
	}
});