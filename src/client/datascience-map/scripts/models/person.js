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

	defaults: {
		id: undefined,
		source: undefined,

		// name info
		//
		title: undefined,
		first_name: undefined,
		last_name: undefined,
		middle_name: undefined,

		// professional info
		//
		primary_affiliation: undefined,
		affiliations: undefined,
		appointment_type: undefined,

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

		// activities
		//
		collaborators: undefined,
		articles: undefined,
		awards: undefined,
		book_chapters: undefined,
		books: undefined,
		conference_proceedings: undefined,
		grants: undefined,
		patents: undefined,
		technologies: undefined,

		// counts
		//
		num_collaborators: undefined,
		num_articles: undefined,
		num_awards: undefined,
		num_book_chapters: undefined,
		num_books: undefined,
		num_conference_proceedings: undefined,
		num_grants: undefined,
		num_patents: undefined,
		num_technologies: undefined,

		// account info
		//
		email: undefined,
		url: undefined,
		options: undefined
	},

	//
	// querying methods
	//

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
	}
});