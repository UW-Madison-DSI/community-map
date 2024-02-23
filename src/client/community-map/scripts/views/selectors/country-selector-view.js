/******************************************************************************\
|                                                                              |
|                              country-selector-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for selecting a country from a list.            |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Country from '../../models/utilities/country.js';
import Countries from '../../collections/utilities/countries.js';
import NameSelectorView from '../../views/selectors/name-selector-view.js';

export default NameSelectorView.extend({

	//
	// attributes
	//

	template: _.template(`
		<select class="selectpicker">
			<% for (let i = 0; i < items.length; i++) { %>
				<% let image = items[i].iso.toLowerCase(); %>
				<option data-subtext="<img src='images/flag-icons/blank.gif' class='flag flag-<%= image %>'/>">
					<%= items[i].name %>
				</option>
			<% } %>
		</select>
	`),

	//
	// methods
	//

	initialize: function() {

		// set attributes
		//
		this.collection = new Countries();
		if (this.options.initialValue) {

			// convert type of initial value to a country
			//
			if (typeof this.options.initialValue == 'string') {
				this.options.initialValue = new Country({
					name: this.options.initialValue
				});
			}
			this.selected = this.options.initialValue;
		}
	},

	//
	// ajax methods
	//

	fetchCountries: function(options) {
		this.collection.fetch({

			// callbacks
			//
			success: () => {

				// add blank item in case users don't want
				// to specify a country
				//
				this.collection.unshift({
					name: '',
					iso: ''
				});

				// peform callback
				//
				if (options && options.success) {
					options.success();
				}
			},

			error: () => {

				// show error dialog
				//
				application.showErrorDialog({
					message: "Could not fetch list of countries."
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			countries: this.collection
		};
	},

	onRender: function() {
		if (this.options.initialValue) {

			// set selected item
			//
			let model = this.collection.findWhere({
				'name': this.options.initialValue.get('name')
			});

			this.$el.find('select')[0].selectedIndex = this.collection.indexOf(model);
		}

		// enable custom select
		//
		this.$el.find('select').selectpicker({
			showSubtext: true
		});

		// call on render callback
		//
		if (this.onrender) {
			this.onrender();
		}

		if (this.collection.length == 0) {
			this.update();
		}
	},

	update: function() {
		this.fetchCountries({

			// callbacks
			//
			success: () => {
				this.render();
			}
		});
	}
});
