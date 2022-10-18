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

		<p>The Data Science @ UW Community Map is for anyone at UW-Madison who is interested in data science. Whether you are a seasoned data science researcher, want to learn more, or support data science efforts on campus, you belong here.  This map was created by the <a href="https://datascience.wisc.edu/institute/" target="_blank">American Family Insurance Data Science Institute</a> to seed data science collaboration across colleges, schools, divisions, departments, and disciplines. Through building these connections, we aim to  strengthen data science research, education and outreach at UW-Madison.</p>
	
		<h3>How to put yourself on the map: </h3>
		<p>Note: You will need a valid UW-Madison email address in order to create an account. </p>
		<ol>
			<li>
				<label>Create Your Account</label>
				<ul>
					<li>Click on the “Sign up” button in the upper right corner of the screen. </li>
					<li>Read and accept the terms and conditions, and click “Next”. </li>
					<li>Complete and submit the brief User Registration Form. You will need to create a username and password for your account. Your password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one number or symbol. </li>
				</ul>
			</li>
			<li>
				<label>Verify Your Email</label>
				<ul>
					<li>Check your UW-Madison email account for a verification email. </li>
					<li>Click the link contained in the email and then click the "Verify" button to verify your email address. </li>
				</ul>
			</li>
			<li>
				<label>Complete Your Profile</label>
				<ul>
					<li>Click the "Sign In" button at upper right corner of the screen. </li> 
					<li>On the "Sign In" dialog, enter the username and password that you specified when creating your account. </li>
					<li>Once you've signed in, click the "Edit My Profile" button at the top of the left sidebar on your profile page. </li>
					<li>On the "Edit My Profile" page, enter information about yourself to let your UW Data Science colleagues know about you. Your location on the map will be determined by your primary department affiliation. </li>
				</ul>
			</li>
		</ol>

		<h3>How to find others on the map:</h3>
		<ul>
			<li>You don’t need to sign in to search the map. </li>
			<li>Use the filters on the left side of the screen to hone in on your areas of interest. </li>
		</ul>

		<br />

		<div class="well">
			Stuck? Visit our <a href="#help">Help</a> page. Do you have suggestions, questions, or other feedback? <a href="#contact">Contact us.</a>
		</div>
	`)
});
