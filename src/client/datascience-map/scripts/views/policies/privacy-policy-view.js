/******************************************************************************\
|                                                                              |
|                            privacy-policy-view.js                            |
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
		<h1><i class="fa fa-info-circle"></i>Privacy</h1>

		<ol class="breadcrumb">
			<li><a href=""><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-info-circle"></i>Privacy</li>
		</ol>

		<h2>Privacy Policy</h2>
		<ul>
			<li>
				<h3>Distribution</h3>
				<p>Any information that is entered into this application will will not be distributed or sold.</p>
			</li>
			<li>
				<h3>Deletion</h3>
				<p>When you delete your account, all information associated with your account will be permanantly deleted.</p>
			</li>
		</ul>
	`)
});
