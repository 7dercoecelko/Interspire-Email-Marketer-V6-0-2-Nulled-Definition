import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel() {
		if (!this.get('session.isAuthenticated')) {
			// redirect if you're not authed
			this.transitionTo('signin');
		} else if (this.get('session.currentUser.channels.firstObject')) {
			// or already have a channel
			this.transitionTo('channel', this.get('session.currentUser.channels.firstObject'));
		}
	},
	model() {
		return this.store.createRecord('channel');
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
	deactivate() {
		var model = this.get('currentModel');

		// reset document title
		document.title = 'Radio4000';

		// remove the record if it wasn't saved
		if (model.get('isNew')) {
			console.log('is new');
			model.deleteRecord();
		}
	},

	// redirect to sign in
	onLogout: Ember.observer('session.isAuthenticated', function() {
		if (!this.get('session.isAuthenticated')) {
			this.transitionTo('signin');
		}
	})
});
