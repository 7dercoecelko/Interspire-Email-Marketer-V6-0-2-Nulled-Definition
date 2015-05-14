import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel() {

		// if already authenticated, redirect to intro
		if (this.get('session.isAuthenticated')) {
			Ember.debug('not authed --> intro');
			this.transitionTo('intro');
		}
	},

	activate() {
		this.controllerFor('application').set('isOnSignIn', true);
	},
	deactivate() {
		this.controllerFor('application').set('isOnSignIn', false);
	}
});
