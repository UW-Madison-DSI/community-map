/******************************************************************************\
|                                                                              |
|                              academic-people.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of academic people.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import People from '../people.js';
import AcademicPerson from '../../models/academic/academic-person.js';
import QueryString from '../../utilities/web/query-string.js';

export default People.extend({

	//
	// attributes
	//

	model: AcademicPerson,

	//
	// finding methods
	//

	findByName(name, options) {
		return this.fetchByName(name, {

			// callbacks
			//
			success: () => {
				let models = this.models;
				for (let i = 0; i < models.length; i++) {
					if (AcademicPerson.has(models[i])) {
						models[i] = AcademicPerson.get(models[i]);
					} else {
						AcademicPerson.set(models[i]);
					}
				}
				this.reset(models);

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			}
		});
	},

	findByLabel(label, options) {
		return this.fetchByLabel(label, {

			// callbacks
			//
			success: () => {
				let models = this.models;
				for (let i = 0; i < models.length; i++) {
					if (AcademicPerson.has(models[i])) {
						models[i] = AcademicPerson.get(models[i]);
					} else {
						AcademicPerson.set(models[i]);
					}
				}
				this.reset(models);

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			}
		});
	},

	//
	// fetching methods
	//

	fetchAll(params, options) {
		return this.fetch(_.extend({}, options, {
			url: config.servers.academic + '/people?' + QueryString.encode(params),
			parse: true
		}));
	},

	fetchByName(name, options) {
		return this.fetch(_.extend({}, options, {
			url: config.servers.academic + '/people?name=' + encodeURIComponent(name),
			parse: true
		}));
	},

	fetchByLabel(label, options) {
		return this.fetch(_.extend({}, options, {
			url: config.servers.academic + '/people?term=' + encodeURIComponent(label),
			parse: true
		}));
	},

	fetchByInstitutionUnit(institutionUnit, options) {
		return this.fetch(_.extend({}, options, {
			url: config.servers.academic + '/institution-units/' + institutionUnit.get('id') + '/people',
			parse: true
		}));
	},

	fetchByInstitutionUnitAffiliation(institutionUnit, options) {
		return this.fetch(_.extend({}, options, {
			url: config.servers.academic + '/institution-units/' + institutionUnit.get('id') + '/affiliations',
			parse: true
		}));
	},
});