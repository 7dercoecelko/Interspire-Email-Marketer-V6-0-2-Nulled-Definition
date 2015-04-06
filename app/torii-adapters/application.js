import Ember from 'ember';

export default Ember.Object.extend({
	// creating a new authorization or authenticating a new session
	open: function(authorization) {
		Ember.debug('open');

		// This is what should be done after authentication. As an example, I'm
		// finding current user here.
		let store = this.get('container').lookup('store:main');

		return new Ember.RSVP.Promise((resolve) => {
			return store.find('user', authorization.uid).then(function(user) {

				// we have a user, set it and channel
				Ember.debug('open with user');
				Ember.run.bind(null, resolve({ currentUser: user }));

			}, () => {
				// no user found, create one

				// but first avoid this bug about unresolved record
				store.recordForId('user', authorization.uid).unloadRecord();

				let newUser = store.createRecord('user', {
					id: authorization.uid,
					provider: authorization.provider,
					name: this._nameFor(authorization)
				});

				newUser.save().then(function(user) {
					Ember.run.bind(null, resolve({ currentUser: user }));
				});
			});
		});
	},

	// validating an existing authorization (like a session stored in cookies)
	fetch: function() {
		// This is what should be done to determine how to fetch a session. Here I am
		// retrieving the auth from firebase and checking if I have a user for that
		// auth. If so, I set currentUser.
		let firebase = this.get('container').lookup('adapter:application').firebase;
		let authData = firebase.getAuth();
		let store = this.get('container').lookup('store:main');

		Ember.debug('fetch');

		return new Ember.RSVP.Promise(function(resolve, reject) {
			if (authData) {
				store.find('user', authData.uid).then(function(user) {

					// we have a user, set it
					Ember.run.bind(null, resolve({ currentUser: user }));

				}, function() {
					Ember.run.bind(null, reject('no session'));
				});
			} else {
				Ember.run.bind(null, reject('no session'));
			}
		});
	},

	// here an authorization is destroyed
	close: function() {
		// This is what should be done to teardown a session. Here I am unloading my
		// models and setting currentUser to null.
		let firebase = this.get('container').lookup('adapter:application').firebase;
		let store = this.get('container').lookup('store:main');

		return new Ember.RSVP.Promise(function(resolve) {
			// store.unloadAll('user');
			// store.unloadAll('message');
			firebase.unauth();
			resolve({ currentUser: null });
		});
	},

	_nameFor: function(auth) {
		if (auth.github) {
			return auth.github.username;
		} else if (auth.facebook) {
			return auth.facebook.displayName;
		} else if (auth.twitter) {
			return auth.twitter.displayName;
		} else if (auth.google) {
			return auth.google.displayName;
		} else {
			throw new Error('could not find a username!');
		}
	}
});
