/*
 * Working authentication with
 * Firebase 2.0.x + Ember.js 1.9.1 + Ember Data Canary + EmberFire 1.3.1 + Ember CLI
 *
 * Note: this assumes you've set up login on your Firebase and
 * only handles Google and Facebook for now,
 *
 * In your templates: <button {{action 'login' 'google'}}>Sign in with Google</button>
 */

import Ember from 'ember';
import ENV from '../config/environment';

// Since I've defined my url in environment.js I can do this
var ref = new window.Firebase(ENV.firebaseURL);

export default {
	name: 'session',
	after: 'store', // Run the initializer after the store is ready

	initialize: function(container, application) {
		// session object is nested here as we need access to the container to get the store
		var session = Ember.Object.extend({
			authed: false,
			user: null,
			userChannel: null,

			// get access to the ember data store
			store: container.lookup('store:main'),

			init: function() {
				// on init try to login
				ref.onAuth(function(authData) {

					// Not authenticated
					if (!authData) {
						this.set('authed', false);
						this.set('authData', null);
						this.set('user', null);
						return false;
					}

					// Authenticated
					this.set('authed', true);
					this.set('authData', authData);
					// var hashedId = md5(authData.uid);
					this.afterAuthentication(authData.uid);
				}.bind(this));
			},

			// Call this from your Ember templates
			login: function(provider) {
				this._loginWithPopup(provider);
			},

			// Call this from your Ember templates
			logout: function() {
				ref.unauth();
			},

			// Default login method
			_loginWithPopup: function(provider) {
				var _this = this;
				// Ember.debug('logging in with popup');
				ref.authWithOAuthPopup(provider, function(error, authData) {
					if (error) {
						if (error.code === "TRANSPORT_UNAVAILABLE") {
							// fall-back to browser redirects, and pick up the session
							// automatically when we come back to the origin page
							_this._loginWithRedirect(provider);
						}
					} else if (authData) {
						// we're good!
						// this will automatically call the on ref.onAuth method inside init()
					}
				});
			},

			// Alternative login with redirect (needed for Chrome on iOS)
			_loginWithRedirect: function(provider) {
				ref.authWithOAuthRedirect(provider, function(error, authData) {
					if (error) {

					} else if (authData) {
						// we're good!
						// this will automatically call the on ref.onAuth method inside init()
					}
				});
			},

			// Runs after succesful auth
			afterAuthentication: function(userId) {
				var _this = this;

				// Either reuse or create a user
				this.store.find('user', userId).then(function() {
					_this.existingUser(userId);
				}, function() {
					_this.createUser(userId);
				});
			},

			// Existing user
			existingUser: function(userId) {
				var _this = this;

				// Set the user and user channel for easy access later
				this.store.find('user', userId).then(function(user) {
					user.get('channels').then(function(channels) {

						// Proceed with existing user
						var userChannel = channels.get('firstObject');
						_this.set('userChannel', userChannel);
						_this.set('user', user);

						// _this.checkAdmin(user);
					});
				});
			},

			// Create a new user
			createUser: function(userId) {
				var _this = this;

				// Without this, Emberfire gives an error
				this.store.unloadAll('user');

				this.get('store').createRecord('user', {
					id: userId,
					provider: this.get('authData.provider'),
					name: this.get('authData.facebook.displayName') || this.get('authData.google.displayName'),
					created: new Date().getTime()
				}).save().then(function(user) {

					// Proceed with the newly create user
					_this.set('user', user);
				});
			},

			// checkAdmin: function(user) {
			// 	if (user.id === 'facebook:10152422494934521' || 'google:109082707013786319045') {
			// 		this.set('isAdmin', true);
			// 	}
			// }
		});

		// Register and inject the 'session' initializer into all controllers and routes
		application.register('session:main', session);
		application.inject('route', 'session', 'session:main');
		application.inject('controller', 'session', 'session:main');
	}
};
