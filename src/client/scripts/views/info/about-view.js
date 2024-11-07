/******************************************************************************\
|                                                                              |
|                                   about-view.js                              |
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
		<h1><i class="fa fa-info-circle"></i>About</h1>

		<ol class="breadcrumb">
			<li><a href=""><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-info-circle"></i>About</li>
		</ol>

		<p>The Data Science @ UW Community Map is for anyone at UW-Madison who is interested in data science. Whether you are a seasoned data science researcher, want to learn more, or support data science efforts on campus, you belong here.  This map was created by the <a href="https://dsi.wisc.edu" target="_blank">American Family Insurance Data Science Institute</a> to seed data science collaboration across colleges, schools, divisions, departments, and disciplines. Through building these connections, we aim to  strengthen data science research, education and outreach at UW-Madison.</p>
	`)
});
