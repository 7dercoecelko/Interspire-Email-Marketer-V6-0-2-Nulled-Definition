import Ember from 'ember';

export default Ember.Controller.extend({
	needs: ['playback'],
	playback: Ember.computed.alias('controllers.playback'),

	lastUpdatedFormatted: Ember.computed('tracks.@each.created', function() {
		var date = this.get('tracks.lastObject.created');
		return window.moment(date).subtract(1, 'days').fromNow();
	}),

	// canEdit: Ember.computed.equal('model.id', 'session.currentUser.channels.firstObject.id'),
	canEdit: Ember.computed('model', 'session.currentUser.channels.firstObject', function() {
		var channel = this.get('model');
		var userChannel = this.get('session.currentUser.channels.firstObject');

		Ember.debug(channel);
		Ember.debug(userChannel);

		// first avoid both props being null === null which equals true (lol)
		if (channel === null || userChannel === null || userChannel === undefined) {
			Ember.debug('something is null');
			return false;
		}

		// then check
		Ember.debug('checking canEdit');
		var canEdit = (channel.get('id') === userChannel.get('id'));
		Ember.debug(canEdit);

		return canEdit;
	}),

	isFavorite: Ember.computed('model', 'session.currentUser.channels.firstObject.favoriteChannels.@each', function() {
		var channel = this.get('model');
		var favorites = this.get('session.currentUser.channels.firstObject.favoriteChannels');

		// guard because this functions runs before userChannel is defined
		if (!favorites) { return false;}

		// true if this channel is a favorite of the user's favorites
		return favorites.contains(channel);
	}),

	actions: {
		play() {
			// Either continues play or plays the newest e.g. last track
			if (this.get('playback.model')) {
				this.get('playback.player').send('play');
			} else {
				this.transitionToRoute('track', this.get('tracks.lastObject'));
			}
		},

		pause() {
			this.get('playback.player').send('pause');
		},

		toggleFavorite() {
			var isFavorite = this.get('isFavorite');
			var userChannel = this.get('session.currentUser.channels.firstObject');
			var favorites = this.get('session.currentUser.channels.firstObject.favoriteChannels');
			var channel = this.get('model');
			var channelPublic = channel.get('channelPublic');
			var channelFollowers = channelPublic.get('followers');

			favorites.then((favs) => {

				// add or remove to user's channel's favorites
				if (isFavorite) {
					favs.removeObject(channel);
				} else {
					favs.addObject(channel);
				}

				// save the parent
				userChannel.save();
			});

			channelFollowers.then((followers) => {

				// toggle the userChannel from this channel's public followers
				if (isFavorite) {
					followers.removeObject(userChannel);
				} else {
					followers.addObject(userChannel);
				}

				// open and save the parent
				channelPublic.then(function(cp) {
					cp.save();
				});
			});
		}
	}
});
