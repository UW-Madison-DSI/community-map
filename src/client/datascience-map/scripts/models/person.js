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

	urlRoot: config.servers.academic + '/people',

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

	getAffiliation: function() {
		return this.get('primary_affiliation') || this.get('affiliations')[0];
	},

	getSecondaryAffiliations() {
		let affiliations = this.get('affiliations') || [];
		return affiliations.remove(this.get('primary_affiliation'));
	},

	//
	// parsing methods
	//

	parsePrimaryAffiliation(response) {
		if (response.primaryUnitAffiliation) {
			return response.primaryUnitAffiliation.baseName;
		} else if (response.otherPrimaryUnitAffiliation) {
			return response.otherPrimaryUnitAffiliation;
		} else if (response.unitName) {
			return response.unitName;
		}
	},

	parsePrimaryAffiliationName(response) {
		if (response.primaryUnitAffiliation) {
			return response.primaryUnitAffiliation.name;
		} else if (response.otherPrimaryUnitAffiliation) {
			return response.otherPrimaryUnitAffiliation;
		} else if (response.unitName) {
			return response.unitName;
		}
	},

	parseAffiliations(response) {
		let affiliations = [];
		if (response.nonPrimaryUnitAffiliations) {
			for (let i = 0; i < response.nonPrimaryUnitAffiliations.length; i++) {
				affiliations.push(response.nonPrimaryUnitAffiliations[i].baseName);
			}
		}
		return affiliations;
	},

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
	},

	parse: function(response) {
		return {
			id: response.id,
			source: 'academic_analytics',
			email: undefined,

			// name info
			//
			title: response.title? response.title : undefined,
			first_name: response.firstName? response.firstName : undefined,
			last_name: response.lastName? response.lastName : undefined,
			middle_name: response.middleName? response.middleName : undefined,

			// affiliation info
			//
			primary_affiliation: this.parsePrimaryAffiliation(response),
			primary_affiliation_name: this.parsePrimaryAffiliationName(response),
			affiliations: this.parseAffiliations(response),
			is_affiliate: response.isAffiliate == 1,
			communities: response.communities,

			// institution info
			//
			appointment_type: response.appointmentType,
			building_number: response.buildingNumber,

			// research info
			//
			research_summary: response.researchSummary,
			research_interests: response.researchInterests,
			research_tools: response.researchTools,
			research_terms: response.researchTerms,

			// academic info
			//
			degree_institution: response.degreeInstitutionName,
			degree_year: response.degreeYear,
			orcid_id: response.orcidId,

			// personal info
			//
			has_profile_photo: response.hasProfilePhoto,
			homepage: response.homepage,
			social_url: response.socialUrl,
			github_url: response.githubUrl,

			// contact info
			//
			url: 'https://wisc.discovery.academicanalytics.com/scholar/stack/' + response.id + '/' + response.firstName + '-' + response.lastName
		};
	}
});