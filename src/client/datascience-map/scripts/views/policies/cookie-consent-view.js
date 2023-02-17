/******************************************************************************\
|                                                                              |
|                            cookie-consent-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the about/information view of the application.           |
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
		<h1><i class="fa fa-info-circle"></i>Cookies</h1>

		<ol class="breadcrumb">
			<li><a href=""><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-info-circle"></i>Cookies</li>
		</ol>

		<h2>Cookie Policy</h2>
		<ul>
			<li>
				<h3>Tracking Cookies</h3>
				<p>No tracking cookies are used in this application.</p>
			</li>
			<li>
				<h3>Session Cookies</h3>
				<p>When you sign in to this application, a session cookie is temporarily stored on your computer to allow you to stay logged in to the application.</p>
			</li>
		</ul>
	`)
});
