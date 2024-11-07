/******************************************************************************\
|                                                                              |
|                                  person.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a person.                                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseModel from '../models/base-model.js';
import InstitutionUnits from '../collections/institution-units.js';
import '../utilities/scripting/string-utils.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		id: undefined,

		// name info
		//
		title: undefined,
		first_name: undefined,
		last_name: undefined,
		middle_name: undefined,

		// affiliation info
		//
		primary_affiliation: undefined,
		affiliations: undefined,
		is_affiliate: undefined,

		// institution info
		//
		appointment_type: undefined,
		building_number: undefined,

		// research info
		//
		research_summary: undefined,
		research_interests: undefined,
		research_terms: undefined,

		// educational info
		//
		degree_institution: undefined,
		degree_year: undefined,

		// personal info
		//
		image: undefined,
		homepage: undefined,

		// account info
		//
		email: undefined,
		url: undefined,
		options: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.community_map + '/users',

	//
	// querying methods
	//

	isAffiliate: function() {
		return this.get('is_affiliate');
	},

	hasTerm: function(term) {
		if (this.has('research_terms')) {
			return this.get('research_terms').includes(term);
		}
	},

	hasTerms: function(terms) {
		if (!terms) {
			return undefined;
		}
		for (let i = 0; i < terms.length; i++) {
			if (this.hasTerm(terms[i])) {
				return true;
			}
		}
		return false;
	},

	hasAppointment: function(appointment) {
		if (this.has('appointment_type')) {
			return this.get('appointment_type').includes(appointment.toLowerCase());
		}
	},

	hasAppointments: function(appointments) {
		if (!appointments) {
			return undefined;
		}
		for (let i = 0; i < appointments.length; i++) {
			if (this.hasAppointment(appointments[i])) {
				return true;
			}
		}
		return false;
	},

	hasProfilePhoto: function() {
		return this.get('has_profile_photo');
	},

	matches: function(name) {
		return this.getName().toLowerCase() == name.toLowerCase();
	},

	//
	// getting methods
	//

	getName: function() {
		let names = [];
		if (this.has('first_name')) {
			names.push(this.get('first_name'));
		}
		if (this.has('middle_name')) {
			names.push(this.get('middle_name'));
		}
		if (this.has('last_name')) {
			names.push(this.get('last_name'));
		}
		return names.join(' ');
	},

	getUrl: function() {
		return '#users/' + this.get('id');
	},

	//
	// profile photo getting methods
	//

	getProfilePhotoUrl: function() {
		if (this.get('has_profile_photo')) {
			return this.url() + '/profile/photo';
		}
	},

	getProfileThumbUrl: function() {
		if (this.get('has_profile_photo')) {
			return this.url() + '/profile/thumb';
		}
	},

	//
	// affiliation getting methods
	//

	getAffiliation: function() {
		let primary = this.getPrimaryAffiliation();
		let secondary = this.getSecondaryAffiliations();
		return primary || (secondary? secondary[0] : undefined);
	},

	getAffiliationName: function() {
		let affiliation = this.getAffiliation();
		return affiliation? affiliation.get('name') : undefined;
	},

	getAffiliationBaseName: function() {
		let affiliation = this.getAffiliation();
		return affiliation? affiliation.get('base_name') : undefined;
	},

	getPrimaryAffiliation: function() {
		let id = this.get('primary_unit_affiliation_id');
		let departments = InstitutionUnits.collection;
		return departments.findWhere({ id: id });
	},

	getPrimaryAffiliationName: function() {
		let primary = this.getPrimaryAffiliation();
		return primary? primary.get('name') : undefined;
	},

	getPrimaryAffiliationBaseName: function() {
		let primary = this.getPrimaryAffiliation();
		return primary? primary.get('base_name') : undefined;
	},

	getSecondaryAffiliations() {
		let affiliations = this.get('affiliations') || [];
		return affiliations.remove(this.getPrimaryAffiliationName());
	},

	//
	// parsing (Backbone) methods
	//

	parseItems: function(data, ItemClass) {
		if (data) {
			let items = [];
			if (data) {
				for (let i = 0; i < data.length; i++) {
					items.push(new ItemClass(data[i], {
						person: this,
						parse: true
					}));
				}
			}
			return items;
		}
	}
});