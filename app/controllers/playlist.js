import Ember from 'ember';

export default Ember.ObjectController.extend({
	needs: ['tracks'],
	firstRun: true,

	// small description
	isExpanded: false,
	// editing
	isEditing: false,

	canEdit: function() {
		return this.get('model.uid') === this.get('auth.authData.uid');
	}.property('model.uid', 'auth.user'),

	// Favorites
	// because it's a hasMany relationship, this needs a bit of extra work to really work
	isFavorite: false,
	isFavoriteTest: function() {
		// only run if you are logged in
		if (!this.get('auth.authed')) { return false; }
		// make sure it runs
		Ember.run.once(this, 'testFavorite');
	}.observes('model', 'auth.user.favoritePlaylists.[]'),
	testFavorite: function() {
		// Ember.debug('test fav');
		var self = this;
		var playlist = this.get('model');
		var favorites = this.get('auth.user.favoritePlaylists');
		this.set('isFavorite', false);
		// console.log(favorites);
		favorites.then(function() {
			favorites.forEach(function(item) {

				console.log('comparing this');
				Ember.debug(playlist);
				console.log('with this');
				Ember.debug(item);

				if (playlist === item) {
					console.log('match');
					self.set('isFavorite', true);
				} else {
					console.log('no match');
				}
			});
		});
	},


	actions: {
		extend: function() {
			this.toggleProperty('isExpanded');
		},
		playLatest: function() {
			this.transitionToRoute('track', this.get('tracks.lastObject'));
		},
		edit: function() {
			this.set('isEditing', true);
		},
		cancel: function() {
			this.set('isEditing', false);
		},
		// Save, transition to new url and close (cancel) the edit mode
		save: function() {
			this.get('model').save().then(function(){
				Ember.debug('Saved playlist');
				this.transitionToRoute('playlist', this.get('slug'));
			}.bind(this));

			this.send('cancel');
		},
		tryDelete: function() {
			var confirmed = confirm('Are you sure? Your playlist will be gone forever. But you can always create a new one.');
			if (confirmed) {
				this.send('deletePlaylist');
			}
		},
		deletePlaylist: function() {
			var user = this.get('auth.user');
			var playlist = this.get('model');

			// also remove the playlist on the user
			// @todo it should remove it on every user…
			Ember.RSVP.Promise.cast(user.get('playlists')).then(function(playlists) {
				playlists.removeObject(playlist);
				// delete the playlist itself
				playlist.destroyRecord();
				this.transitionToRoute('application');
				Ember.debug('Playlist deleted');
				user.save().then(function() {
					Ember.debug('Success: playlist removed from user');
				});
			});

			// @todo remove it in all users favoritePlaylists relationships
		},
		toggleFavorite: function() {
			if (this.get('model.isSaving')) { return false; }

			var self = this;

			var user = this.get('auth.user');
			var playlist = this.get('model');


			user.get('favoritePlaylists').then(function(favorites) {
				// Ember.debug(favorites);
				// Ember.debug(isFavorite);

				// either add or remove the favorite
				if (!this.get('isFavorite')) {
					Ember.debug('adding');
					favorites.addObject(playlist);
				} else {
					Ember.debug('removing');
					user.reload(); // hack! without this it won't remove the object
					favorites.removeObject(playlist);
				}

				user.save();
				this.toggleProperty('isFavorite');


			}.bind(this));
		}
	}
});
