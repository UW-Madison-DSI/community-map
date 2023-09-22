/******************************************************************************\
|                                                                              |
|                                  main-router.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for this application.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from './views/base-view.js';

export default Backbone.Router.extend({

	//
	// attributes
	//

	templates: 'templates',

	//
	// route definitions
	//

	routes: {

		// main routes
		//
		'': 'showWelcome',
		
		// user registration routes
		//
		'register': 'showRegister',
		'register/verify-email/:id': 'showVerifyEmail',
	
		// email change verification
		//
		'verify-email/:id': 'showVerifyEmailChange',

		// password reset routes
		//
		'reset-password/:id': 'showResetPassword',

		// my account routes
		//
		'home': 'showHome',
		'my-profile': 'showMyProfile',
		'my-profile/edit': 'showEditMyProfile',

		// user profile routes
		//
		'users/:id': 'showUserProfile',

		// administration routes
		//
		'overview': 'showSystemOverview',
		'accounts/review(?*query_string)': 'showReviewAccounts',

		// user account routes
		//
		'accounts/:id(/:nav)': 'showUserAccount',

		// info routes
		//
		'contact': 'showContact',
		'*address': 'showInfo'
	},

	//
	// route handlers
	//

	showWelcome: function() {
		import(
			'./views/main-split-view.js'
		).then((MainSplitView) => {

			// show home view
			//
			application.show(new MainSplitView.default(), {
				full_screen: true
			});
		});
	},

	showHome: function() {
		if (!application.session.user) {

			// go to welcome view
			//
			Backbone.history.navigate('', {
				trigger: true
			});
			return;
		}

		import(
			'./views/home-view.js'
		).then((HomeView) => {

			// show home view
			//
			application.show(new HomeView.default(), {
				nav: 'home',
				full_screen: true
			});
		});
	},

	//
	// user registration route handlers
	//

	showRegister: function() {
		import(
			'./views/users/registration/aup-view.js'
		).then((AUPView) => {

			// show aup view
			//
			application.show(new AUPView.default());
		});
	},

	showVerifyEmail: function(id) {
		Promise.all([
			import('./models/users/user.js'), 
			import('./models/users/email-verification.js'), 
			import('./views/users/email-verification/verify-email-view.js')
		]).then(([User, EmailVerification, VerifyEmailView]) => {

			// fetch email verification
			//
			let emailVerification = new EmailVerification.default({
				id: id
			});

			emailVerification.fetch({

				// callbacks
				//
				success: () => {

					// fetch user corresponding to this email verification
					//
					let user = new User.default(emailVerification.get('user'));

					// show verify email view
					//
					application.show(new VerifyEmailView.default({
						model: emailVerification,
						user: user
					}));
				},

				error: () => {

					// show error dialog
					//
					application.showErrorDialog({
						message: "We could not verify this user."
					});
				}
			});
		});
	},

	showVerifyEmailChange: function(verificationKey) {
		Promise.all([
			import('./models/users/user.js'), 
			import('./models/users/email-verification.js'), 
			import('./views/users/email-verification/verify-email-changed-view.js')
		]).then((User, EmailVerification, VerifyEmailChangedView) => {

			// fetch email verification
			//
			let emailVerification = new EmailVerification.default({
				verification_key: verificationKey
			});

			emailVerification.fetch({

				// callbacks
				//
				success: () => {

					// fetch user corresponding to this email verification
					//
					let user = new User(emailVerification.get('user'));

					// show verify email changed view
					//
					application.show(new VerifyEmailChangedView({
						model: emailVerification,
						user: user
					}));
				},

				error: () => {

					// show error dialog
					//
					application.showErrorDialog({
						message: "We could not verify this user."
					});
				}
			});
		});
	},

	//
	// password reset route handlers
	//

	showResetPassword: function(id) {
		Promise.all([
			import('./models/users/password-reset.js'), 
			import('./views/users/reset-password/reset-password-view.js'), 
			import('./views/users/reset-password/invalid-reset-password-view.js')
		]).then(([PasswordReset, ResetPasswordView, InvalidResetPasswordView]) => {

			// fetch password reset
			//
			new PasswordReset.default({
				'id': id
			}).fetch({

				// callbacks
				//
				success: (model) => {

					// show reset password view
					//
					application.show(new ResetPasswordView.default({
						model: model
					}));
				},

				error: () => {

					// show invalid reset password view
					//
					application.show(new InvalidResetPasswordView.default());
				}
			});
		});
	},

	//
	// my profile route handlers
	//

	showMyProfile: function() {
		import(
			'./views/users/accounts/my-profile-view.js'
		).then((MyProfileView) => {

			// show edit my profile view
			//
			application.show(new MyProfileView.default(), {
				nav: 'home'
			});
		});
	},

	showEditMyProfile: function() {
		import(
			'./views/users/accounts/edit/edit-my-profile-view.js'
		).then((EditMyProfileView) => {

			// show edit my profile view
			//
			application.show(new EditMyProfileView.default(), {
				nav: 'home'
			});
		});
	},

	//
	// user profile route handlers
	//

	showUserProfile: function(id) {
		Promise.all([
			import('./models/person.js'),
			import('./views/person-view.js'),
		]).then(([Person, PersonView]) => {

			// show home view
			//
			application.show(new PersonView.default({
				person: new Person.default({
					id: id
				})
			}), {
				full_screen: true
			});
		});
	},

	//
	// info page route handlers
	//

	showInfo: function(address) {
		this.fetchTemplate(address, (text) => {

			// show info page
			//
			application.show(new BaseView({
				template: _.template(text)
			}), {
				nav: address.contains('/')? address.split('/')[0] : address
			});
		});
	},

	showContact: function() {
		import(
			'./views/info/contact-view.js'
		).then((ContactView) => {

			// show contact view
			//
			application.show(new ContactView.default(), {
				nav: 'contact'
			});
		});
	},

	//
	// error route handlers
	//

	showNotFound: function(options) {
		import(
			'./views/not-found-view.js'
		).then((NotFoundView) => {

			// show not found page
			//
			application.show(new NotFoundView.default(options));
		});
	},

	//
	// utility methods
	//

	fetchTemplate(address, callback) {
		fetch(this.templates + '/' + address + '.tpl').then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.text();
		}).then(template => {
			callback(template);
			return;
		}).catch(error => {

			// show 404 page
			//
			this.showNotFound({
				title: "Page Not Found",
				message: "The page that you are looking for could not be found: " + address,
				error: error
			});
		});
	}
});