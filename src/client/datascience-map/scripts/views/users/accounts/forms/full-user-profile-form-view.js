/******************************************************************************\
|                                                                              |
|                        full-user-profile-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for editing information for people.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';
import TreeView from '../../../../views/sidebar/trees/tree-view.js';
import '../../../../views/forms/validation/alphanumeric-rules.js';
import '../../../../views/forms/validation/authentication-rules.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`

		<fieldset>
			<legend>Name</legend>

			<div class="form-group" id="title">
				<label class="control-label">Title</label>
				<div class="controls">
					<div class="input-group">
						<select>
							<option value="">None</option>
							<option value="professor">Professor</option>
							<option value="associate professor">Associate Professor</option>
						</select>
					</div>
				</div>
			</div>

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

		<fieldset>
			<legend>Research</legend>

			<div class="form-group" id="department">
				<label class="control-label">Department / Primary Affiliation</label>
				<div class="controls">
					<div class="input-group">
						<select>
							<option value="">None</option>
							<option value="other">Other</option>
							<% if (departments) { %>
							<% for (let i = 0; i < departments.length; i++) { %>
							<% let department = departments.at(i); %>
							<option value="<%= department.get('id') %>"><%= department.get('name').toTitleCase() %></option>
							<% } %>
							<% } %>
						</select>
					</div>
				</div>
			</div>

			<div class="form-group" id="other-department" style="display:none">
				<label class="control-label">Other Department / Primary Affiliation</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="form-control">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Other Department / Primary Affiliation" data-content="This is your primary affiliation / department."></i>
						</div>	
					</div>
				</div>
			</div>

			<div class="form-group" id="appointment-type">
				<label class="control-label">Appointment Type</label>
				<div class="controls">
					<div class="input-group">
						<select>
							<option value="">None</option>
							<% if (appointment_types) { %>
							<% for (let i = 0; i < appointment_types.length; i++) { %>
							<% let appointment_type = appointment_types[i]; %>
							<option value="<%= appointment_type.toLowerCase() %>"><%= appointment_type %></option>
							<% } %>
							<% } %>
						</select>
					</div>
				</div>
			</div>

			<div class="form-group" id="is-affiliate">
				<label class="control-label">DSI Affiliate</label>
				<div class="controls">
					<div class="checkbox">
						<label>
							<input type="checkbox" <% if (is_affiliate) { %> checked="checked" <% } %> />
							Have you applied and been selected to participate in the <a href="https://datascience.wisc.edu/dsi-affiliates" target="_blank">Data Science Institute Affiliate Program</a>?
						</label>
					</div>
				</div>
			</div>

			<div class="form-group" id="communities">
				<label class="control-label">Communities</label>
				<div class="controls">
					<% for (i = 0; i < all_communities.length; i++) { %>
					<% let community = all_communities[i]; %>
					<% let communityName = community.replace(/-/g, ' ').toTitleCase(); %>
					<div class="checkbox">
						<label>
							<input type="checkbox" value="<%= community %>"<% if (!communities || communities.includes(community)) { %> checked="checked" <% } %> />
							<%= communityName %>
						</label>
					</div>
					<% } %>
				</div>
			</div>

			<div class="form-group" id="building">
				<label class="control-label">Building</label>
				<div class="controls">
					<div class="input-group">
						<select>
							<option value="">Default (Your Department Building)</option>
							<% if (buildings) { %>
							<% for (let i = 0; i < buildings.length; i++) { %>
							<% let building = buildings.at(i); %>
							<% let buildingKind = building.get('object_type'); %>
							<% if (buildingKind == 'building') { %>
							<% let building_name = building.get('name'); %>
							<% let building_number = building.get('building_number'); %>
							<% if (!building_name.startsWith('Lot')) { %>
							<option value="<%= building_number %>"><%= building_name %></option>
							<% } %>
							<% } %>
							<% } %>
							<% } %>
						</select>
					</div>
				</div>
			</div>

			<div class="form-group" id="research-summary">
				<label class="control-label">Research Summary</label>
				<div class="controls">
					<div class="input-group">
					<textarea rows="5"></textarea>
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Research Summary" data-content="This is a summary of your research."></i>
						</div>	
					</div>
				</div>
			</div>

			<div class="form-group" id="data-science-interests">
				<label class="control-label">Your Attributes</label>
				<div class="checkboxes col-sm-6 col-xs-12">
					<p class="form-control-static">
						Please select the items that apply to you:
						<div class="terms-selector"></div>
					</p>
				</div>
			</div>

			<div class="form-group" id="research-interests">
				<label class="control-label">Other Attributes</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="form-control">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Other Interests" data-content="This is a comma separated list of items of interest to you."></i>
						</div>	
					</div>
				</div>
			</div>
		</div>

		<fieldset>
			<legend>Academic</legend>

			<div class="form-group" id="degree-institution-name">
				<label class="control-label">Degree Institution</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="form-control">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Degree Institution" data-content="This is the name of the institution that you graduated from."></i>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group" id="degree-year">
				<label class="control-label">Degree Year</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="form-control">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Degree Year" data-content="This is the year that you graduated."></i>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group" id="orcid-id">
				<label class="control-label">ORCID</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="form-control" name="orcid">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="ORCID" data-content="This is your Open Researcher and Contributor ID."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>

		<fieldset>
			<legend>Personal</legend>

			<div class="form-group" id="profile-photo">
				<label class="control-label">Profile Photo</label>
				<div class="controls">
					<div class="input-group">
						<input type="file" id="file" class="form-control" style="display:none" />
						<button class="select-photo btn"><label for="file"><%= has_profile_photo? 'Change photo' : 'Select photo' %></label></button>
					</div>
				</div>
			</div>

			<div class="form-group" id="homepage">
				<label class="control-label">Homepage</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="form-control">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Homepage" data-content="This is the URL of your home page or personal website."></i>
						</div>	
					</div>
				</div>
			</div>

			<div class="form-group" id="social-url">
				<label class="control-label">Social URL</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="form-control">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Social URL" data-content="This is the URL of your social media page."></i>
						</div>	
					</div>
				</div>
			</div>

			<div class="form-group" id="github-url">
				<label class="control-label">GitHub URL</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="form-control">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="GitHub URL" data-content="This is the URL of your GitHub / code sharing page."></i>
						</div>	
					</div>
				</div>
			</div>
		</div>

		<fieldset>
			<legend>Notifications</legend>

			<% let keys = Object.keys(defaults.options); %>
			<% for (let i = 0; i < keys.length; i++) { %>
			<% let key = keys[i]; %>
			<% let option = defaults.options[key]; %>
			<div class="form-group option" id="<%= key %>">
				<label class="control-label"><%= option.label %></label>
				<div class="controls">
					<div class="checkbox">
						<label>
							<input type="checkbox" />
							<%= option.description %>
						</label>
					</div>
				</div>
			</div>
			<% } %>
		</fieldset>

		<br />

		<span class="required"></span>Fields are required.
	`),

	regions: {
		terms: '.terms-selector'
	},

	events: {
		'change #department select': 'onChangeDepartment',
		'click #all input[type="checkbox"]': 'onClickAll',
		'click .topic input[type="checkbox"]': 'onClickTopic',
		'change input[type="file"]': 'onChangeFile',
		'click .change-photo': 'onChangePhoto'
	},

	rules: {
		'orcid': {
			isValidOrcid: true,
			required: false
		},
	},

	//
	// constructor
	//
	
	initialize: function() {
		this.terms = application.getCollection(defaults.terms);	
		this.termsList = this.toList(defaults.terms);

		// add custom form validation rules
		//
		this.addRules();
	},

	toList: function(object) {
		let list = [];
		if (object) {
			let keys = Object.keys(object);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				let item = object[key];
				list.push(key);
				if (item) {
					if (Array.isArray(item)) {
						list = list.concat(item);
					} else if (typeof item == 'object') {
						let sublist = this.toList(item);
						list = list.concat(sublist);
					}
				}
			}
		}
		return list;
	},

	//
	// validating methods
	//

	addRules: function() {

		// add password validation rule
		//
		$.validator.addMethod("isValidOrcid", (value) => {
			return value == '' || value.length == 19 && /(\d{4}-){3}\d{3}(\d|X)/.test(value);
		}, "ORCIDs must be of the form: xxxx-xxxx-xxxx-xxxx.");
	},

	//
	// querying methods
	//

	hasProfilePhoto: function() {
		return this.$el.find('#profile-photo input').val() != '';
	},

	//
	// getting methods
	//

	getCommunities: function() {
		var selected = [];
		$('#communities input:checked').each(function() {
			selected.push($(this).val());
		});
		return selected;
	},

	getTerms: function() {
		return this.getChildView('terms').getValues();
	},

	getTermList: function(string) {
		return string.split(",").map(function(item) {
			return item.trim();
		});
	},

	getOptionKinds: function() {
		let kinds = [];
		let elements = this.$el.find('.option');
		for (let i = 0; i < elements.length; i++) {
			kinds.push($(elements[i]).attr('id'));
		}
		return kinds;
	},

	getOptions: function() {
		let kinds = this.getOptionKinds();
		let options = [];
		for (let i = 0; i < kinds.length; i++) {
			let kind = kinds[i];
			if (this.$el.find('#' + kind + ' input').is(':checked')) {
				options.push(kind);
			}	
		}
		return options;
	},

	getValue: function(key) {
		switch (key) {

			// name
			//
			case 'title':
				return this.$el.find('#title select').val();
			case 'name':
				return this.$el.find('#name input').val();

			// affiliation
			//
			case 'department_id': {
				let value = this.$el.find('#department select').val();
				if (value != 'other') {
					return parseInt(value);
				} else {
					return 0;
				}
			}
			case 'department':
				if (!this.getValue('department_id')) {
					return this.$el.find('#other-department input').val();
				} else {
					return null;
				}
			case 'is_affiliate':
				return this.$el.find('#is-affiliate input').is(':checked');
			case 'communities':
				return this.getCommunities();

			// institution
			//
			case 'appointment_type':
				return this.$el.find('#appointment-type select').val();
			case 'building_number':
				return parseInt(this.$el.find('#building select').val());

			// research
			//
			case 'research_summary':
				return this.$el.find('#research-summary textarea').val();
			case 'research_terms':
				return this.getTerms().concat(this.getValue('research_interests'));
			case 'research_interests':
				return this.getTermList(this.$el.find('#research-interests input').val());

			// academic
			//
			case 'degree_institution_name':
				return this.$el.find('#degree-institution-name input').val();
			case 'degree_year':
				return this.$el.find('#degree-year input').val();
			case 'orcid_id':
				return this.$el.find('#orcid-id input').val();

			// personal
			//
			case 'profile_photo':
				return this.$el.find('#profile-photo input').val();
			case 'homepage':
				return this.$el.find('#homepage input').val();
			case 'social_url':
				return this.$el.find('#social-url input').val();
			case 'github_url':
				return this.$el.find('#github-url input').val();

			// options
			//
			case 'options':
				return this.getOptions();
		}
	},

	getValues: function() {
		let name = this.getValue('name');
		let names = name.split(' ');
		let first_name, middle_name, last_name;

		if (names.length == 1) {
			last_name = names[length];
		} else if (names.length == 2) {
			first_name = names[0];
			last_name = names[1];
		} else {
			first_name = names[0];
			middle_name = names.slice(1, -1).join(' ');
			last_name = names[names.length - 1];
		}

		return {

			// name
			//
			title: this.getValue('title'),
			first_name: first_name,
			middle_name: middle_name,
			last_name: last_name,

			// affiliation
			//
			primary_unit_affiliation_id: this.getValue('department_id'),
			primary_unit_affiliation: this.getValue('department'),
			non_primary_unit_affiliation_ids: [this.getDepartmentId('Data Science')],
			is_affiliate: this.getValue('is_affiliate'),
			communities: this.getValue('communities'),

			// institution
			//
			appointment_type: this.getValue('appointment_type'),
			building_number: this.getValue('building_number'),

			// research
			//
			research_summary: this.getValue('research_summary'),
			research_terms: this.getValue('research_terms'),

			// academic
			//
			degree_institution_name: this.getValue('degree_institution_name'),
			degree_year: this.getValue('degree_year'),
			orcid_id: this.getValue('orcid_id'),

			// personal
			//
			homepage: this.getValue('homepage'),
			profile_photo: this.getValue('profile_photo'),
			social_url: this.getValue('social_url'),
			github_url: this.getValue('github_url'),

			// options
			//
			options: this.getValue('options')
		};
	},

	getDepartmentId: function(name) {
		let departments = this.options.departments;
		for (let i = 0; i < departments.length; i++) {
			let department = departments.at(i);
			if (department.get('base_name') == name) {
				return department.get('id');
			}
		}
	},

	getOtherAttributes: function(attributes) {
		let otherAttributes = [];
		for (let i = 0; i < attributes.length; i++) {
			let attribute = attributes[i];
			if (!this.termsList.includes(attribute)) {
				otherAttributes.push(attribute);
			}
		}
		return otherAttributes;
	},

	//
	// form submitting methods
	//

	submit: function(options) {

		// check form validation
		//
		if (!this.check()) {
			return null;
		} else if (this.hasProfilePhoto()) {
			this.submitWithImages(options);
		} else {
			let values = this.getValues();
			values.profile_photo = this.$el.find('#profile-photo input')[0];

			// save model
			//
			this.model.save(this.getValues(), options);

			return this.model;
		}
	},

	submitWithImages: function(options) {
		let values = this.getValues();
		let input = this.$el.find('#profile-photo input')[0];
		let path = $(input).val();
		let fReader = new FileReader();
		fReader.readAsDataURL(input.files[0]);
		fReader.onloadend = (event) => {
			let filename = path.replace(/^.*[\\\/]/, '')

			// add photo data to values
			//
			values.profile_photo_name = filename;
			values.profile_photo = event.target.result;

			// save model
			//
			this.model.save(values, options);
			return this.model;
		}
	},

	//
	// setting methods
	//

	setOption: function(option, value) {
		this.$el.find('#' + option + ' input').prop('checked', value);
	},

	setOptions: function(options) {
		if (options) {
			for (let i = 0; i < options.length; i++) {
				this.setOption(options[i], true);
			}
		}
	},

	setValue: function(key, value) {
		switch (key) {

			// name
			//
			case 'title':
				this.$el.find('#title select').val(value? value.toLowerCase() : undefined);
				break;
			case 'first_name':
				this.$el.find('#first-name input').val(value);
				break;
			case 'middle_name':
				this.$el.find('#middle-name input').val(value);
				break;
			case 'last_name':
				this.$el.find('#last-name input').val(value);
				break;

			// professional
			//
			case 'department_id': {
				if (value) {
					this.$el.find('#department select').val(value);
					this.hideOtherDepartment();
				} else if (value == 0) {
					this.$el.find('#department select').val('other');
					this.showOtherDepartment();
				}
				break;
			}
			case 'department': {
				this.$el.find('#other-department input').val(value? value.name : '');
				break;
			}
			case 'appointment_type':
				this.$el.find('#appointment-type select').val(value);
				break;
			case 'building_number':
				this.$el.find('#building select').val(value);
				break;

			// research
			//	
			case 'research_summary':
				this.$el.find('#research-summary textarea').val(value);
				break;
			case 'research_terms':
				this.setTerms(value);
				this.$el.find('#research-interests input').val(this.getOtherAttributes(value).join(', '));
				break;
			/*
			case 'research_interests':
				this.$el.find('#research-interests input').val(value.join(', '));
				break;
			*/

			// academic
			//
			case 'degree_institution_name':
				this.$el.find('#degree-institution-name input').val(value);
				break;
			case 'degree_year':
				this.$el.find('#degree-year input').val(value);
				break;
			case 'orcid_id':
				this.$el.find('#orcid-id input').val(value);
				break;

			// personal
			//
			case 'homepage':
				this.$el.find('#homepage input').val(value);
				break;
			case 'social_url':
				this.$el.find('#social-url input').val(value);
				break;
			case 'github_url':
				this.$el.find('#github-url input').val(value);
				break;

			// options
			//
			case 'options':
				return this.setOptions(value);
		}
	},

	setValues: function(attributes) {
		let keys = Object.keys(attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = attributes[key];
			this.setValue(key, value);
		}
	},

	setTerms: function(terms) {
		this.getChildView('terms').setValues(terms);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let communities = this.model.get('communities');
		if (!communities || communities.length == 0) {
			communities = [defaults.community];
		}

		return {
			name: this.model.getName(),
			departments: this.options.departments,
			appointment_types: defaults.appointment_types,
			communities: communities,
			all_communities: defaults.communities,
			buildings: this.options.buildings,
			interests: defaults.interests
		}
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('terms', new TreeView({
			collection: this.terms,
			sortWithCollection: false,
			expanded: defaults.expanded.terms
		}));
		this.$el.find('#data-science-interests input[type="checkbox"]').prop('checked', false);

		// initialize form
		//
		this.setValues({

			// name
			//
			title: this.model.get('title'),
			first_name: this.model.get('first_name'),
			middle_name: this.model.get('middle_name'),
			last_name: this.model.get('last_name'),

			// professional
			//
			department_id: this.model.get('primary_unit_affiliation_id'),
			department: this.model.get('primary_unit_affiliation'),
			appointment_type: this.model.get('appointment_type'),
			building_number: this.model.get('building_number'),

			// research
			//
			research_summary: this.model.get('research_summary'),
			research_terms: this.model.get('research_terms'),
			research_interests: this.model.get('research_interests'),

			// academic
			//
			degree_institution_name: this.model.get('degree_institution_name'),
			degree_year: this.model.get('degree_year'),
			orcid_id: this.model.get('orcid_id'),

			// personal
			//
			profile_photo: this.model.get('profile_photo'),
			homepage: this.model.get('homepage'),
			social_url: this.model.get('social_url'),
			github_url: this.model.get('github_url'),

			// options
			//
			options: this.model.get('options')
		});
	},

	showOtherDepartment: function() {
		this.$el.find('#other-department').show();
	},

	hideOtherDepartment: function() {
		this.$el.find('#other-department').hide();
	},

	//
	// mouse event handling methods
	//

	onChangeDepartment: function() {
		if (this.$el.find('#department select').val() == 'other') {
			this.$el.find('#other-department input').val('');
			this.showOtherDepartment();
		} else {
			this.hideOtherDepartment();
		}
	},

	onClickAll: function(event) {
		if ($(event.target).is(':checked')) {
			this.$el.find('#research-interests input[type="checkbox"]').prop('checked', true);
		} else {
			this.$el.find('#research-interests input[type="checkbox"]').prop('checked', false);
		}
	},

	onChangeFile: function() {
		this.$el.find('input[type="file"]').show();
		this.$el.find('input[type="file"] + button').hide();
	},

	onClickChangePhoto: function() {
		this.$el.find('input[type="file"]').trigger('click');
	}
});