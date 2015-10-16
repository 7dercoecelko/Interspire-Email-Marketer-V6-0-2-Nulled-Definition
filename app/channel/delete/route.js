import Ember from 'ember';

const {debug} = Ember;

export default Ember.Route.extend({
	// todo: this is repeated for channel/[add,edit,delete] routes
	beforeModel() {
		const authed = this.get('session.isAuthenticated');
		const userChannel = this.get('session.currentUser.channels.firstObject');

		if (!authed || !userChannel) {
			debug('not authed or no channel --> login');
			this.transitionTo('login');
		}
	},

	afterModel(model) {
		const userChannelId = this.get('session.currentUser.channels.firstObject.id');
		const userOwnsTheChannel = model.get('id') === userChannelId;

		if (!userOwnsTheChannel) {
			debug('not allowed to edit --> login');
			this.transitionTo('login');
		}
	},

	// don't render into channel because we don't want channel templates here
	renderTemplate() {
		this.render({
			into: 'application'
		});
	}
});
