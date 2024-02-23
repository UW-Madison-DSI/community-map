/******************************************************************************\
|                                                                              |
|                                    aup-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the acceptable use policy view used in the new           |
|        user registration process.                                            |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import UserRegistrationView from '../../../views/users/registration/user-registration-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<h1><i class="fa fa-user-plus"></i>Add Me To The Map!</h1>

		<ol class="breadcrumb">
			<li><a href=""><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-user-plus"></i>Add Me</li>
		</ol>

		<p>If you are a UW <%= community %> practitioner, you can add yourself to the map to connect with the UW <%= community %> community. Once you've added yourself to the map, you can update or delete your profile at any time. </p>
		
		<hr />

		<h2>Acceptable Use Policy</h1>
		<ul>
			<li>
				<h3>Open To UW-Madison Affiliates Only</h3>
				<p>To register to be included on the Affiliates Map, you will need a "wisc.edu" email address. You may only register using your own email account. </p>
			</li>
			<li>
				<h3>Truthfulness</h3>
				<p>When creating your profile, please represent yourself, your interests, and your skills honestly and accurately.</p>
			</li>
		</ul>

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
		
		<h2>Statement of Agreement</h2>
		<p>By clicking 'I Accept' it serves as acknowledgement that you have read and understand the Terms and Conditions.</p>
		
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert">
				<i class="fa fa-close"></i>
			</button>
			<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
		</div>
		
		<form action="/" id="aup-form">
			<div class="checkbox well">
				<label>
					<input type="checkbox" name="accept" id="accept" class="required" >
					I accept
				</label>
			</div>
		</form>
		
		<div class="buttons">
			<button id="submit" class="btn btn-primary btn-lg"><i class="fa fa-arrow-right"></i>Next</button>
			<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
		</div>
	`),

	events: {
		'click .alert .close': 'onClickAlertClose',
		'click #submit': 'onClickSubmit',
		'click #cancel': 'onClickCancel'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let community = defaults.community || '';

		if (community == 'all') {
			community = 'research';
		}

		return {
			community: community.replace(/-/g, ' ')
		};
	},

	onRender: function() {

		// validate form
		//
		this.validator = this.validate();
	},

	showWarning: function() {
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// form validation methods
	//

	validate: function() {

		// validate form
		//
		return this.$el.find('#aup-form').validate({
			rules: {
				'accept': {
					required: true
				}
			},
			messages: {
				'accept': {
					required: "You must accept the terms to continue."
				}
			}
		});
	},

	isValid: function() {
		return this.validator.form();
	},

	//
	// event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickSubmit: function() {

		// check validation
		//
		if (this.isValid()) {
			this.undelegateEvents();

			if (this.options && this.options.accept) {
				this.options.accept();
			} else {

				// show next view
				//
				application.show(new UserRegistrationView());
			}
		} else {
			this.showWarning();
		}
	},

	onClickCancel: function() {

		// go to home view
		//
		Backbone.history.navigate('', {
			trigger: true
		});
	}
});
