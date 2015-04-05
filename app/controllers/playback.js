import Ember from 'ember';

export default Ember.Controller.extend({
	isMaximized: false,
	isShuffled: false,
	historyWasUpdated: false,

	// channel gets set by the track route
	channel: null,

	// all listened tracks
	// history: [],
	history: Ember.A([]),

	// all tracks not in the history array
	// there is probably a computed macro to handle this.
	unplayed: Ember.computed('history.[]', 'tracks.[]', function () {
		var history = this.get('history');
		var tracks = this.get('tracks');

		if (!tracks) { return; }

		return tracks.filter(function(track) {
			return !history.contains(track);
		});
	}),

	// generates a ytid if the model doesn't have one already
	// @todo: this should be removed when no longer necessary
	validateTrack: Ember.observer('model.ytid', function() {
		if (!this.get('model.ytid')) {
			this.get('model').updateProvider();
		}
	}),

	// unplayed: Ember.computed.filter('tracks', function(track, index) {
	// 	return !this.get('history').contains(track);
	// }),

	// tracks from the current channel
	tracks: Ember.computed('channel.tracks.[]', function() {
		return this.get('channel.tracks');
	}),

	// gets the index of the current track
	getCurrentTrackIndex: Ember.computed('tracks', 'model', function() {
		return this.get('tracks').indexOf(this.get('model'));
	}),

	// gets a random track
	getRandomTrack() {
		var random = Math.floor(Math.random() * this.get('tracks.length'));
		return this.get('tracks').objectAt(random);
	},

	updateHistory: Ember.observer('model', function() {
		var history = this.get('history');
		var historyWasUpdated = this.get('historyWasUpdated');

		if (historyWasUpdated) { return; }

		history.pushObject(this.get('model'));
		this.set('historyWasUpdated', true);
		// Ember.debug('model changed');
	}),

	// Clears history every time the channel changes
	clearHistory: Ember.observer('channel', function() {
		this.get('history').clear();
	}),

	actions: {

		// use this to play a track, if you don't want the url to change
		playTrack(track) {
			if (!track) { return false; }

			// Ember.debug('Playing track: ' + track.get('title'));
			this.transitionToRoute('track', track);
		},

		prev() {
			var isShuffled = this.get('isShuffled');
			var history = this.get('history');
			var tracks = this.get('tracks');
			var model = this.get('model');
			var newTrack;

			// without shuffle
			if (!isShuffled) {
				// play prev in tracks
				newTrack = tracks.objectAt(tracks.indexOf(model) + 1);

				if (newTrack) {
					return this.send('playTrack', newTrack);
				} else {
					// or play last
					return this.send('playLast');
				}
			}

			// with shuffle
			if (isShuffled) {
				// play prev in history
				newTrack = history.objectAt(history.indexOf(model) - 1);

				if (newTrack) {
					return this.send('playTrack', newTrack);
				} else {
					// or play prev in tracks
					newTrack = tracks.objectAt(tracks.indexOf(model) + 1);
				}

				if (newTrack) {
					return this.send('playTrack', newTrack);
				} else {
					// or reset
					// Ember.debug('resetting');
					this.clearHistory();
					return this.set('model', null);
				}
			}
		},

		next() {
			var unplayed = this.get('unplayed');
			var len = unplayed.get('length');
			var isShuffled = this.get('isShuffled');
			var tracks = this.get('tracks');
			var model = this.get('model');
			var newTrack;

			// go to a random item from the unplayed items
			if (isShuffled) {
				newTrack = unplayed.objectAt(Math.floor(Math.random() * len));
			} else if (model) {
				// or go to next
				newTrack = tracks.objectAt(tracks.indexOf(model) - 1);
			} else {
				// or go to first
				newTrack = unplayed.get('lastObject');
			}

			if (!newTrack) {
				this.clearHistory();
				return this.send('playFirst');
			}

			if (isShuffled) {
				this.get('history').pushObject(newTrack);
			}

			this.send('playTrack', newTrack);
		},

		playPrev() {},

		playFirst() {
			// first is last because we have newest on top
			var firstTrack = this.get('tracks.lastObject');
			// this.get('history').pushObject(firstTrack);
			this.send('playTrack', firstTrack);
			// Ember.debug('Playing first track');
		},

		playLast() {
			// last is first because we have newest on top
			var lastTrack = this.get('tracks.firstObject');
			this.send('playTrack', lastTrack);
			// this.get('history').pushObject(lastTrack);
			// Ember.debug('Playing last track');
		},

		// Toggles "fullscreen mode"
		toggle() {
			this.toggleProperty('isMaximized');
		},

		ytPlaying() {
			// Ember.debug('on playing from controller');
		},
		ytPaused() {
			// Ember.debug('on paused from controller');
		},
		ytEnded() {
			// Ember.debug('on ended from controller');
			this.send('next');
		},
		ytError(error) {
			// Ember.debug('on yt error from controller');
			console.log(error);

			// dont do anything on 'invalid parameter'
			if (error === 2) { return; }

			// otherwise play next
			this.send('next');
		}
	}
});
