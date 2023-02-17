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
import CreditsDialogView from '../../views/dialogs/credits-dialog-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="container">
			<a href="<%= defaults.application.organization.url%>" target="_blank"><img class="logo" src="images/uw-logo-white.png" /></a>
			<p>
				Copyright &copy; <%= defaults.application.year %>
				<a href="<%= defaults.application.department.url %>" target="_blank"><%= defaults.application.department.name %></a>, 
				<a href="<%= defaults.application.organization.url %>" target="_blank"><%= defaults.application.organization.name %></a>
				<br />
				<a href="#privacy">Privacy Policy</a> | 
				<a href="#cookies">Cookie Policy</a> |
				<a id="credits">Credits</a>
			</p>
		</div>
	`),

	events: {
		'click #credits': 'onClickCredits'
	},

	//
	// mouse event handling methods
	//

	onClickCredits: function() {
		application.show(new CreditsDialogView());
	}
});
