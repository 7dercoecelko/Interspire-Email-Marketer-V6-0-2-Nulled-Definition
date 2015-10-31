import Ember from 'ember';

export default Ember.Component.extend({
	player: Ember.inject.service(),
	uiStates: Ember.inject.service(),

	actions: {
		togglePlay() {
			this.attrs.radioDevice.value.send('togglePlay');
		},
		play() {
			this.attrs.radioDevice.value.send('play');
		},
		pause() {
			this.attrs.radioDevice.value.send('pause');
		},
		prev() {
			this.get('player').prev();
		},
		next() {
			this.get('player').next();
		},
		toggleFullscreen() {
			this.toggleProperty('uiStates.isFullscreen');
		}
	}
});

// gets the index of the current track
// currentTrackIndex: Ember.computed('tracks', 'model', function () {
// 	return this.get('tracks').indexOf(this.get('model'));
// }),

// resetRemote: Ember.on('init', function () {
// 	let channel = this.get('session.currentUser.channels.firstObject');
// }),

// // @TODO: this should only be active if the user enabled "remote control" setting
// // (which doesn't exist yet)
// updateFromRemote: Ember.observer('session.currentUser.channels.firstObject.listeningToTrack', function () {

// 	if (!this.get('session.currentUser')) {
// 		Ember.warn('updated without user');
// 		return;
// 	}

// 	const channel = this.get('session.currentUser.channels.firstObject');
// 	const track = channel.get('listeningToTrack');

// 	debug(channel);
// 	debug(track);

// 	if (!track) {
// 		Ember.warn('updated without track');
// 		return;
// 	}

// 	debug('remotely changed track');
// 	this.set('channel', channel);
// 	this.set('model', track);
// }),
