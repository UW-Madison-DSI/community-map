/******************************************************************************\
|                                                                              |
|                              profile-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a person's profile information.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'profile',

	template: _.template(`
		<fieldset>
			<legend>Research</legend>

			<% if (primary_affiliation) { %>
			<div id="primary-affiliation">
				<label>Primary Affiliation</label>
				<%= primary_affiliation %>
			</div>
			<% } %>

			<% if (appointment_type) { %>
			<div id="appointment-type">
				<label>Appointment Type</label>
				<%= appointment_type.toTitleCase() %><% if (is_affiliate) { %>, Data Science Institute Affiliate<% } %>
			</div>
			<% } %>

			<% if (affiliations && affiliations.length > 0) { %>
			<div id="affiliations">
				<label>Other Affiliations</label>
				<%= other_affiliations.join(', ') %>
			</div>
			<% } %>

			<% if (research_summary) { %>
			<div id="summary">
				<label>Research Summary</label>
				<%= research_summary %>
			</div>
			<% } %>

			<% if (research_terms) { %>
			<div id="research-terms">
				<label>Research Interests</label>
				<%= research_terms %>
			</div>
			<% } %>

			<% if (communities && communities.length > 0) { %>
			<div id="communities">
				<label>Communities</label>
				<%= communities.join(', ') %>
			</div>
			<% } %>
		</fieldset>

		<fieldset>
			<legend>Academic</legend>

			<% if (degree_institution) { %>
			<div id="degree-institution">
				<label>Degree Institution</label>
				<%= degree_institution %>
				<% if (degree_year) { %>
				<%= degree_year %>
				<% } %>
			</div>
			<% } %>

			<% if (orcid_id) { %>
			<div id="orcid_id">
				<label>ORCID</label>
				<a href="https://orcid.org/<%= orcid_id %>" target="_blank">https://orcid.org/<%= orcid_id %></a>
			</div>
			<% } %>
		</fieldset>

		<% if (homepage || social_url || github_url) { %>
		<fieldset>
			<legend>Personal</legend>

			<% if (homepage) { %>
			<div id="homepage">
				<label>Home Page</label>
				<a href="<%= homepage %>" target="_blank"><%= homepage %></a>
			</div>
			<% } %>

			<% if (social_url) { %>
			<div id="social-url">
				<label>Social</label>
				<a href="<%= social_url %>" target="_blank"><%= social_url %></a>
			</div>
			<% } %>

			<% if (github_url) { %>
			<div id="github-url">
				<label>GitHub / Code</label>
				<a href="<%= github_url %>" target="_blank"><%= github_url %></a>
			</div>
			<% } %>
		</fieldset>
		<% } %>
	`),

	toUrl: function(url) {
		if (url) {
			if (!url.startsWith('http')) {
				url = 'http://' + url;
			}
		}
		return url;
	},

	toDepartmentName: function(name) {
		if (name && name.endsWith(', Center for')) {
			return "Center of " + name.replace(', Center for', '');
		} else if (name && name.endsWith(', Department of')) {
			return "Department of " + name.replace(', Department of', '');
		} else if (name && name.endsWith(', Institute for Research on')) {
			return "Institute for Research on " + name.replace(', Institute for Research on', '');
		} else {
			return name;
		}
	},

	toNames: function(terms) {
		let names = [];
		if (terms) {
			for (let i = 0; i < terms.length; i++) {
				names.push(terms[i].replace(/-/g, ' ').toTitleCase());
			}
		}
		return names;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			degree_institution: this.model.get('degree_institution') || 'unknown',
			primary_affiliation: this.model.getPrimaryAffiliationName() || 'unknown',
			appointment_type: this.model.get('appointment_type'),
			is_affiliate: this.model.isAffiliate(),
			research_terms: this.model.has('research_terms')? this.model.get('research_terms').join(', ') : '',
			other_affiliations: this.model.getSecondaryAffiliations(),
			communities: this.toNames(this.model.get('communities')),
			homepage: this.toUrl(this.model.get('homepage')),
			social_url: this.toUrl(this.model.get('social_url')),
			github_url: this.toUrl(this.model.get('github_url'))
		};
	},

	onRender: function() {

		// highlight terms
		//
		if (this.options && this.options.query) {
			this.highlight(this.options.query, this.options);
		}
	},

	highlightHtml: function(element, keyword, options) {
		let $el = $(element);
		let html = $el.html();

		if (!html) {
			return;
		}

		// split by whitespace
		//
		let words = html.split(/ /);

		// highlight text
		//	
		for (let i = 0; i < words.length; i++) {
			if (!words[i].includes('<') && !words[i].includes('>')) {
				if (options && options.exact) {
					if (words[i]) {
						words[i] = '<span class="highlighted">' + words[i] + '</span>';
					}
				} else {
					if (words[i].toLowerCase().includes(keyword.toLowerCase())) {
						words[i] = '<span class="highlighted">' + words[i] + '</span>';
					}		
				}
			}
		}
		html = words.join(' ');

		$el.html(html);
	},

	highlight: function(keyword, options) {
		this.highlightHtml(this.$el.find('#summary'), keyword, options);
		this.highlightHtml(this.$el.find('#research-terms'), keyword, options);
	}
});