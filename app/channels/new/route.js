import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel() {

		// redirect if you're not authed
		if (!this.get('session.isAuthenticated')) {
			this.transitionTo('login');

		} else if (this.get('session.currentUser.channels.firstObject')) {
			Ember.debug('aready have channel');
			this.transitionTo('channel', this.get('session.currentUser.channels.firstObject'));
		}
	},
	model() {
		// return this.store.createRecord('channel');
	},
	afterModel() {
		document.title = 'New - Radio4000';
	},
	renderTemplate() {
		// don't render into channels outlet - this avoids the tabs we have on channels.hbs
		this.render({
			into: 'application'
		});
	},

	activate() {
		// set minimal ui style
		this.controllerFor('application').set('isMinimalUi', true);
	},
	deactivate() {
		// remove minimal ui style
		this.controllerFor('application').set('isMinimalUi', false);

		// reset document title
		document.title = 'Radio4000';
	},

	// redirect to log in
	onLogout: Ember.observer('session.isAuthenticated', function() {
		if (!this.get('session.isAuthenticated')) {
			this.transitionTo('login');
		}
	})
});
