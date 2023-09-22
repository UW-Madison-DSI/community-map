/******************************************************************************\
|                                                                              |
|                                application.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level application.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Router from './router.js';
import BaseModel from './models/base-model.js';
import Session from './models/users/session.js';
import AcademicPerson from './models/academic/academic-person.js';
import BaseCollection from './collections/base-collection.js';
import MainView from './views/layout/main-view.js';
import PageView from './views/layout/page-view.js';
import DialogView from './views/dialogs/dialog-view.js';
import ErrorDialogView from './views/dialogs/error-dialog-view.js';
import NotifyDialogView from './views/dialogs/notify-dialog-view.js';
import StatusDialogView from './views/dialogs/status-dialog-view.js';
import ConfirmDialogView from './views/dialogs/confirm-dialog-view.js';
import DownloadDialogView from './views/dialogs/download-dialog-view.js';
import KnowledgeMapView from './views/maps/knowledge-map-view.js';
import PersonMarkerView from './views/maps/overlays/people/person-marker-view.js';
import Browser from './utilities/web/browser.js';
import './utilities/time/date-format.js';
import './utilities/scripting/string-utils.js';
import './utilities/scripting/array-utils.js';
import './utilities/web/html-utils.js';

export default Marionette.Application.extend({

	//
	// attributes
	//

	region: {
		el: 'body',
		replaceElement: false
	},

	//
	// constructor
	//

	initialize: function() {

		// add helpful class for mobile OS'es
		//
		$('body').attr('device', Browser.device);
		if (Browser.device == 'phone' || Browser.device == 'tablet') {
			$('body').addClass('mobile');
		}

		// create new session
		//
		this.session = new Session();

		// in the event of a javascript error, reset the pending ajax spinner
		//
		$(window).on('error', function() {
			if ($.active > 0) {
				$.active = 0;
				$.event.trigger('ajaxStop');
			}
		});

		// ensure all cookie information is forwarded by default and watch for expired or fraudluent sessions
		//
		$.ajaxSetup({
			xhrFields: {
				withCredentials: true
			}
		});

		// log the user out if their session is found to be invalid
		//
		$(document).ajaxError((event, jqXHR) => {
			if (jqXHR.responseText === 'SESSION_INVALID') {
				this.error({
					message: "Sorry, your session has expired, please log in again.",
					
					// callbacks
					//
					accept: () => {
						application.session.logout({

							// callbacks
							// 
							success: () => {

								// go to welcome view
								//
								Backbone.history.navigate("#", {
									trigger: true
								});
							}
						});
					}
				});
			}
		});

		// set ajax calls to display wait cursor while pending
		//
		/*
		$(document).ajaxStart(() => {
			$('html').attr('style', 'cursor: wait !important;');
			$(document).trigger( $.Event('mousemove') );
		}).ajaxStop(() => {
			if ($.active < 1) {
				$('html').attr('style', 'cursor: default');
				$(document).trigger( $.Event('mousemove') );
			}
		});
		*/

		// store handle to application
		//
		window.application = this;

		// create routers
		//
		this.router = new Router();
	},

	//
	// getting methods
	//

	getURL: function() {
		let protocol = window.location.protocol;
		let hostname = window.location.host;
		let pathname = window.location.pathname;
		return protocol + '//' + hostname + pathname;
	},

	getInterestsList: function(interests) {
		let collection = new BaseCollection();
		for (let i = 0; i < interests.length; i++) {
			this.collection.add(new BaseModel({
				interest: interests[i],
				count: 0
			}), {
				sort: false
			});
		}
		return collection;
	},

	getCollection: function(items) {
		let collection = new BaseCollection();

		// check if we have any items
		//
		if (!items) {
			return collection;
		}

		if (items.length) {
			for (let i = 0; i < items.length; i++) {
				collection.add(new BaseModel({
					name: items[i]
				}), {
					sort: false
				});
			}
		} else {
			let keys = Object.keys(items);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				if (!items[key]) {
					collection.add(new BaseModel({
						name: key
					}), {
						sort: false
					});
				} else {
					collection.add(new BaseModel({
						name: key,
						collection: this.getCollection(items[key])
					}), {
						sort: false
					});
				}
			}
		}
		return collection;
	},

	//
	// getting methods
	//

	getQueryString: function() {

	},

	//
	// startup methods
	//

	start: function() {

		// call superclass method
		//
		Marionette.Application.prototype.start.call(this);

		// call initializer
		//
		this.initialize();

		// check to see if user is logged in
		//
		this.relogin();
	},

	relogin: function() {

		// get previously logged in user
		//
		this.session.getUser({

			// callbacks
			//
			success: (user) => {
				this.session.user = user;
				Backbone.history.start();
			},

			error: () => {

				// session has expired
				//
				this.session.user = null;
				Backbone.history.start();
			}
		});
	},

	logout: function() {

		// end session
		//
		this.session.logout({

			// callbacks
			//
			success: () => {
				this.update();

				// go to welcome view
				//
				Backbone.history.navigate('', {
					trigger: true
				});
				
				window.location.reload();
			},
			
			error: (jqxhr, textstatus, errorThrown) => {

				// show error dialog
				//
				this.error({
					message: "Could not log out: " + errorThrown + "."
				});
			}
		});
	},

	//
	// rendering methods
	//

	show: function(view, options) {
		if (view instanceof DialogView) {

			// show modal dialog
			//
			this.showDialog(view, options);
		} else if (!options || !options.full_screen) {

			// show page view
			//
			this.showView(new PageView({
				contentView: view,
				nav: options? options.nav : undefined
			}));
		} else {

			// show main view
			//
			this.showView(new MainView({
				contentView: view,
				nav: options? options.nav : undefined
			}));
		}
	},

	update: function() {

		// clear cache
		//
		this.reset();
				
		// update header
		//
		if (this.getView('body').getChildView('header').currentView) {
			this.getView('body').getChildView('header').currentView.render();
		}
	},

	reset: function() {
		KnowledgeMapView.reset();
		AcademicPerson.reset();
		PersonMarkerView.reset();
	},

	//
	// dialog rendering methods
	//

	showDialog: function(dialogView, options) {
		this.hideDialogs();
		this.showDelayedDialog(dialogView, options);
	},

	showDelayedDialog: function(dialogView, options) {
		this.pendingDialogView = dialogView;
		window.setTimeout(() => {
			if (this.pendingDialogView) {
				this.pendingDialogView.show(options);
				this.dialogView = this.pendingDialogView;
				this.pendingDialogView = null;
			}
		}, 1000);
	},

	showErrorDialog: function(options) {
		this.showDialog(new ErrorDialogView(options));
	},

	showNotifyDialog: function(options) {
		this.showDialog(new NotifyDialogView(options));
	},

	showStatusDialog: function(options) {
		this.showDialog(new StatusDialogView(options));
	},

	showConfirmDialog: function(options) {
		this.showDialog(new ConfirmDialogView(options));
	},

	showDownloadDialog: function(options) {
		this.showDialog(new DownloadDialogView(options));
	},

	destroyDialogs: function() {
		if (this.dialogView) {
			this.dialogView.destroy();
			this.dialogView = null;
		}
		this.pendingDialogView = null;
	},

	hideDialogs: function() {
		if (this.dialogView) {
			this.dialogView.hide();
			this.dialogView = null;
		}
		this.pendingDialogView = null;
	}
});