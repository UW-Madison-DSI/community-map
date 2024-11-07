/******************************************************************************\
|                                                                              |
|                                query-string.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file contains some javascript utilities that are used to         |
|        deal with the browser address bar.                                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import AddressBar from '../../utilities/web/address-bar.js';
import Url from '../../utilities/web/url.js';

export default {

	//
	// converting methods
	//

	toObject: function() {
		return this.decode(this.get());
	},

	//
	// querying methods
	//

	exists: function() {
		return AddressBar.get('location').contains('?');
	},

	has: function(key, options) {
		return (this.value(key, options) != undefined);
	},

	//
	// getting methods
	//

	get: function() {
		let location = AddressBar.get('location');

		// get location after question mark symbol
		//
		if (location.contains('?')) {
			let terms = location.split('?');
			return terms[terms.length - 1];
		}
	},

	value: function(key, options) {
		let queryString;

		// get query string
		//
		if (options && options.queryString) {
			queryString = options.queryString;
		} else {
			queryString = this.get();
		}

		if (!queryString) {
			return undefined;
		}
		
		// split query string into key value pairs
		//
		let terms = queryString.split('&');
		for (let i = 0; i < terms.length; i++) {
			let term = terms[i];

			// split key value pair by first equal sign
			//
			let equalSign = term.indexOf('=');
			let string = term.substr(0, equalSign);
			let value = term.substr(equalSign + 1, term.length);

			// check if key matches
			//
			if (key == string) {
				return value;
			}
		}
		
		return undefined;
	},

	values: function(key, options) {
		let queryString;
		let values = [];

		// get query string
		//
		if (options && options.queryString) {
			queryString = options.queryString;
		} else {
			queryString = this.get();
		}

		if (!queryString) {
			return undefined;
		}
		
		// split query string into key value pairs
		//
		let terms = queryString.split('&');
		for (let i = 0; i < terms.length; i++) {
			let term = terms[i];

			// split key value pair by first equal sign
			//
			let equalSign = term.indexOf('=');
			let string = term.substr(0, equalSign);
			let value = term.substr(equalSign + 1, term.length);

			// check if key matches
			//
			if (string == key) {
				values.push(value);
			}
		} 
		
		return values;
	},

	//
	// setting methods
	//

	set: function(queryString) {
		let address = AddressBar.get('base') + (queryString? "?" + queryString : '');
		AddressBar.set(address);
	},

	push: function(queryString) {
		let address = AddressBar.get('base') + (queryString? "?" + queryString : '');
		AddressBar.push(address);
	},

	clear: function() {
		let address = AddressBar.get('location').split('?')[0];
		AddressBar.set(address);
	},

	delete: function(key) {
		let values = this.toObject();
		delete values[key];
		this.set(this.encode(values));
	},

	//
	// adding methods
	//

	concat: function(queryString, newString) {
		if (queryString && queryString != '' && newString && (newString != undefined)) {
			return queryString + '&' + newString;
		} else if (queryString && queryString != '') {
			return queryString;
		} else {
			return newString;
		}
	},

	add: function(queryString, data) {
		for (let key in data) {
			let value = data[key];
			if (value) {
				queryString = this.concat(queryString, key + '=' + value.toString());
			}				
		}
		return queryString;
	},

	//
	// converting methods
	//

	encode: function(data) {
		let queryString = '';
		for (let key in data) {
			let value = data[key];
			if (value) {
				if (typeof value != 'string') {
					value = value.toString();
				}
				queryString = this.concat(queryString, key + '=' + Url.encode(value));
			}
		}
		return queryString;
	},

	decode: function(queryString) {
		let data = {};
		if (queryString) {
			let terms = queryString.split('&');
			for (let i = 0; i < terms.length; i++) {
				let term = terms[i];

				// split key value pair by first equal sign
				//
				let equalSign = term.indexOf('=');
				let key = term.substr(0, equalSign);
				let value = term.substr(equalSign + 1, term.length);

				// check for array values
				//
				if (key.endsWith('[]')) {

					// add item to array
					//
					let array = key.substring(0, key.length - 2);
					if (data[array]) {
						data[array].push(value);
					} else {
						data[array] = [value];
					}
				} else {
					data[key] = value;
				}
			}
		}
		return data;
	}
};