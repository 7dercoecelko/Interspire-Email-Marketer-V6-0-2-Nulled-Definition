import Ember from 'ember';

const {get} = Ember;

export default Ember.Route.extend({
	beforeModel() {
		const flashMessages = get(this, 'flashMessages');

		// If we do not unload the user model, Firebase will warn about permissions.
		const user = get(this, 'session.currentUser');
		user.get('settings').then(settings => {
			settings.unloadRecord();
			user.unloadRecord();

			get(this, 'session').close().then(() => {
				flashMessages.warning(`You have been signed out`);
				this.transitionTo('auth.login');
			});
		});
	}
});
