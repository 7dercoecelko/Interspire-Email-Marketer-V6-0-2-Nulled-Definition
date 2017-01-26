import Ember from 'ember';

const {Controller, inject, computed, debug} = Ember;

export default Controller.extend({
	firebaseApp: inject.service(),
	init() {
		this._super();
		this.getActiveUserAccounts();
		console.log("this.get('firebaseApp').auth().currentUser", this.get('firebaseApp').auth().currentUser );

	},
	accounts: null,
	providerData: null,
	getActiveUserAccounts() {
		// This called will set the `accounts` array, triggering the `hasProviderName`s CPs
		// used to display link/unLink buttons for each of them
		// this method is called after each link/unlink and on page controller load
		// because the firebaseApp.auth() cannot be made a CP
		let providerData = this.get('firebaseApp').auth().currentUser.providerData;
		let accounts = providerData.map(provider => {
			return provider.providerId;
		});
		this.set('accounts', accounts);
		this.set('providerData', providerData);
	},
	hasGoogle: computed('accounts', function() {
		return this.get('accounts').contains('google.com');
	}),
	hasFacebook: computed('accounts', function() {
		return this.get('accounts').contains('facebook.com');
	}),
	hasEmail: false,

	actions: {
		linkAccount(provider) {
			let auth = this.get('firebaseApp').auth();
			auth.currentUser.linkWithPopup(provider).then(result => {
				debug(`Accounts successfully linked: ${result}`);
				this.getActiveUserAccounts();
			}).catch(err => {
				debug(err);
			});
		},
		unlinkAccount(providerId) {
			debug(`provider ${providerId} unlink starting`);
			this.get('firebaseApp').auth().currentUser.unlink(providerId).then(function() {
				debug(`provider ${providerId} un-linked`);
				this.getActiveUserAccounts();
			}, function(error) {
				debug(`provider ${providerId} un-linked ERROR: ${error}`);
			});
		}
	}
});
