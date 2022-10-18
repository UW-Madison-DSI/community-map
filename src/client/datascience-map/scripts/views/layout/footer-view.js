/******************************************************************************\
|                                                                              |
|                                 footer-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application footer and associated content.           |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="footer container">
			<a href="<%= defaults.application.organization.url%>" target="_blank"><img class="logo" src="images/uw-logo-white.png" /></a>
			<p>
				Copyright &copy; <%= defaults.application.year %>
				<a href="<%= defaults.application.department.url %>" target="_blank"><%= defaults.application.department.name %></a>, 
				<a href="<%= defaults.application.organization.url %>" target="_blank"><%= defaults.application.organization.name %></a>
			</p>
		</div>
	`)
});
