/******************************************************************************\
|                                                                              |
|                               academic-book.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an academic book.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Book from '../../activities/book.js';
import Contributor from '../academic-person.js';
	
export default Book.extend({

	//
	// attributes
	//

	baseUrl: config.servers.academic + '/books',

	//
	// parsing methods
	//

	parseContributors(data) {
		let contributors = [];
		for (let i = 0; i < data.length; i++) {
			contributors.push(new Contributor(data[i], {
				parse: true
			}));
		}
		return contributors;
	},

	parse: function(response, options) {
		return {
			id: response.id,
			title: response.title,
			abstract: response.abstract,

			// parse date
			//
			year: response.activityYear,
			publication_date: new Date(response.publishDate),

			// parse details
			//
			isbn: response.isbn,
			publisher: response.publisher,

			// parse team
			//
			contributors: this.parseContributors(response.contributors, options),
		}
	}
});