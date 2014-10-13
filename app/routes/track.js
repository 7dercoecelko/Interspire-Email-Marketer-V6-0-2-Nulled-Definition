import Ember from 'ember';

export default Ember.Route.extend({

	// 1. don't use the outlet of playlist.hbs, but an outlet in application.hbs
	renderTemplate: function() {

		// 2. actually, don't render at all

		// this.render('track', {
		// 	into: 'application',
		// 	outlet: 'player'
		// });
	},

	// 3. but set the model of playback to the track, that's all!
	setupController: function(controller, model) {
		this.controllerFor('playback').set('model', model);
	},

	deactivate: function() {
		// make sure fullscreen video is off
		this.controllerFor('playback').set('isMaximized', false);
	}
});
