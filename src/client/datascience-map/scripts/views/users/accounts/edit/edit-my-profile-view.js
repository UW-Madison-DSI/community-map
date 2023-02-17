/******************************************************************************\
|                                                                              |
|                           edit-my-profile-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for editing the user's profile information.       |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import InstitutionUnits from '../../../../collections/academic/academic-institution-units.js';
import Buildings from '../../../../collections/buildings.js';
import BaseView from '../../../../views/base-view.js';
import FullUserProfileFormView from '../../../../views/users/accounts/forms/full-user-profile-form-view.js';
import PersonMarkerView from '../../../../views/maps/overlays/people/person-marker-view.js';
import KnowledgeMapView from '../../../../views/maps/knowledge-map-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<h1><div class="icon"><i class="fa fa-pencil"></i></div>Edit My Profile</h1>
		
		<ol class="breadcrumb" style="display:none">
			<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-pencil"></i>Edit My Profile</li>
		</ol>
		
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert">
				<i class="fa fa-close"></i>
			</button>
			<strong>Error: </strong>This form contains errors.  Please correct and resubmit.
		</div>
				
		<div id="user-profile-form">
		</div>
		
		<br />

		<div class="buttons">
			<button id="save" class="btn btn-primary btn-lg"><i class="fa fa-save"></i>Save</button>
			<button id="change-password" class="btn btn-lg"><i class="fa fa-lock"></i>Change Password</button>
			<button id="delete-account" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Account</button>
			<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
		</div>
	`),

	regions: {
		form: "#user-profile-form"
	},

	events: {
		"click .alert .close": "onClickAlertClose",
		"click #save": "onClickSave",
		"click #change-password": "onClickChangePassword",
		"click #delete-account": "onClickDeleteAccount",
		"click #cancel": "onClickCancel"
	},

	//
	// methods
	//

	initialize: function() {
		this.model = application.session.user;
	},

	saveUser: function() {

		// check validation
		//
		if (!this.getChildView('form').submit({

			// callbacks
			//
			success: (model) => {

				// update user name in header (if changed)
				//
				application.update();

				// return to home view
				//
				Backbone.history.navigate("#home", {
					trigger: true
				});
			},

			error: () => {

				// show error dialog
				//
				application.showErrorDialog({
					message: "Could not save user profile changes."
				});
			}
		})) {
			this.showWarning();
		}
	},

	deleteAccount: function() {

		// confirm delete
		//
		application.showConfirmDialog({
			icon: 'fa fa-trash',
			title: "Delete My Account",
			message: "Are you sure that you would like to delete your user account? " +
				"When you delete an account, all of your user data will permanantly deleted.",

			// callbacks
			//
			accept: () => {

				// delete user
				//
				this.model.destroy({

					// callbacks
					//
					success: () => {

						// show success notification dialog
						//
						application.showNotifyDialog({
							title: "My Account Deleted",
							message: "Your user account has been successfuly deleted.",

							// callbacks
							//
							accept: () => {

								// end session
								//
								application.session.logout({

									// callbacks
									//
									success: () => {

										// go to welcome view
										//
										Backbone.history.navigate("#", {
											trigger: true
										});
									},
									
									error: (jqxhr, textstatus, errorThrown) => {

										// show error dialog
										//
										application.showErrorDialog({
											message: "Could not log out: " + errorThrown + "."
										});
									}
								});
							}
						});
					},

					error: () => {

						// show error dialog
						//
						application.showErrorDialog({
							message: "Could not delete your user account."
						});
					}
				});
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {
		new InstitutionUnits().fetch({

			// callbacks
			//
			success: (departments) => {
				new Buildings().fetch({

					// callbacks
					//
					success: (buildings) => {

						// show child views
						//
						this.showChildView('form', new FullUserProfileFormView({
							model: this.model,
							departments: departments,
							buildings: buildings
						}));
					}
				});
			}
		});
	},

	showWarning: function() {
		this.$el.find(".alert-warning").show();
	},

	hideWarning: function() {
		this.$el.find(".alert-warning").hide();
	},

	//
	// dialog rendering methods
	//

	showChangePasswordDialog: function() {
		import(
			'../../../../views/users/accounts/dialogs/change-password-dialog-view.js'
		).then((ChangePasswordDialogView) => {

			// show change password dialog
			//
			application.show(new ChangePasswordDialogView.default({
				parent: this
			}));
		});
	},

	showResetPasswordDialog: function() {
		import(
			'../../../../views/users/reset-password/dialogs/reset-password-dialog-view.js'
		).then((ResetPasswordDialogView) => {

			// show reset password dialog
			//
			application.show(new ResetPasswordDialogView.default({
				username: application.session.user.get('username'),
				parent: this
			}));
		});
	},

	//
	// event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickSave: function() {
		this.saveUser();
	},

	onClickChangePassword: function() {
		this.showChangePasswordDialog();
	},

	onClickResetPassword: function() {
		this.showResetPasswordDialog();
	},

	onClickDeleteAccount: function() {
		this.deleteAccount();
	},

	onClickCancel: function() {

		// return to home view
		//
		Backbone.history.navigate("#home", {
			trigger: true
		});
	}
});