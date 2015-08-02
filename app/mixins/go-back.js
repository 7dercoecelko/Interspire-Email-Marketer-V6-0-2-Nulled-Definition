import Ember from 'ember';

const { debug } = Ember;

export default Ember.Mixin.create({

	// Used to determine when the window.history.back() would take
	// us out of the application (e.g. back to google, provided you came from there)
	recordInitialHistoryLength: Ember.on('init', function() {
		this.set('initialHistoryLength', window.history.length);
	}),

	actions: {
		goBack() {
			let history = window.history;
			let wouldExit = history.length > this.get('initialHistoryLength');

			if (history.state.path === '/') {
				// debug('already at root');
				this.transitionTo('application');
			} else if (!wouldExit) {
				// debug('not at last history yet so we go back');
			  history.back();
			} else {
				// debug('to application');
				this.transitionTo('application');
			}
		}
	}
});
