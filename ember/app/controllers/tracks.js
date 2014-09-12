import Ember from 'ember';

export default Ember.ArrayController.extend({
	needs: ['auth', 'playlist'],

	// Sort by newest on top
	sortProperties: ['created'],
	sortAscending: false,

	trackIsValid: function() {
		var isValid = true;
		['trackUrl', 'trackTitle'].forEach(function(field) {
			if (this.get(field) === '') {
				isValid = false;
			}
		}, this);
		Ember.debug(isValid);
		return isValid;
	},

	actions: {
		addTrack: function() {
			this.set('isAdding', true);
		},
		cancelTrack: function() {
			this.set('isAdding', false);
		},
		publishTrack: function(playlist, track) {
			if (!this.trackIsValid()) {
				Ember.debug('invalid track - wont publish');
				return;
			}

			Ember.debug('valid track - published');

			// Close the edit box
			this.set('isAdding', false);

			// Create a new track
			track = this.get('store').createRecord('track', {
				url: this.get('trackUrl'),
				title: this.get('trackTitle'),
				body: this.get('trackBody'),
				created: new Date().getTime()
			});

			// Get the parent playlist
			playlist = this.get('controllers.playlist').get('model');

			// Save the track
			track.save().then(function() {
				// And add it to the tracks property of the playlist
				Ember.RSVP.Promise.cast(playlist.get('tracks')).then(function(tracks) {
					tracks.addObject(track);
					playlist.save().then(function() {
						Ember.debug('Success: Track saved to playlist');
					}, function() {
						Ember.debug('Error: Track NOT saved to playlist');
					});
				});
			});

			// Reset the fields
			this.setProperties({
				trackUrl: '',
				trackTitle: '',
				trackBody: ''
			});
		}
	}
});
