/* global document */
import Ember from 'ember';

const {debug, inject} = Ember;

export default Ember.Service.extend({
	playerRandom: inject.service(),
	playerHistory: inject.service(),
	isPlaying: false,
	isLooped: true,
	isRandom: false,
	model: null,
	playlist: null,

	// this caches the current playlist and sets it
	// if it really did change (through the model)
	// also sets the old one as inactive, and new as… active!
	updatePlaylist(newPlaylist) {
		const currentPlaylist = this.get('playlist');
		if (currentPlaylist) {
			if (Ember.isEqual(currentPlaylist.get('id'), newPlaylist.get('id'))) {
				debug('This playlist is already set.');
				return;
			}
			currentPlaylist.set('isInPlayer', false);
		}
		this.set('playlist', newPlaylist);
		newPlaylist.set('isInPlayer', true);
		newPlaylist.get('tracks').then(tracks => {
			this.get('playerRandom').setNewRandomPool(tracks);
		});
	},

	// just play/pause activations for the current track in player (and metrics)
	play(currentTrack = this.get('model')) {
		this.set('isPlaying', true);
		this.get('playerHistory').setTrackAsPlayed(currentTrack);
	},

	pause() {
		this.set('isPlaying', false);
	},

	/**
		Plays a track
		Give it a track, and he'll know what to do with it
	*/
	playTrack(model) {
		if (!model) {
			debug('Play called without a track.');
			return false;
		}
		this.setProperties({model, isPlaying: true});
		this.setDocumentTitle();
		model.get('channel').then(channel => this.updatePlaylist(channel));
	},

	setDocumentTitle() {
		if (!document) {
			throw new Error('no document');
		}
		document.title = `${this.get('model.title')} on ${this.get('playlist.title')}`;
	},

	/**
		prev
		decides which track to play
		depends on the active play mode
	*/
	prev() {
		const isRandom = this.get('isRandom');
		if (isRandom) {
			return this.prevRandom();
		}
		return this.prevNormal();
	},

	prevNormal() {
		const playlist = this.get('playlist');
		const prev = this.getPrev();
		if (!prev) {
			this.get('playerHistory').clearPlayerHistory();
			// first is last because we have newest on top
			return this.playTrack(playlist.get('tracks.firstObject'));
		}
		return this.playTrack(prev);
	},

	prevRandom() {
		this.get('playerRandom').getPrevious().then(prev => {
			return this.playTrack(prev);
		});
	},

	/**
		next
		decide which next track is going to play
		depends on the active play mode
	*/
	next() {
		if (this.get('isRandom')) {
			return this.nextRandom();
		}
		return this.nextNormal();
	},

	nextNormal() {
		const playlist = this.get('playlist');
		const next = this.getNext();
		if (!next) {
			this.get('playerHistory').clearPlayerHistory();
			// first is last because we have newest on top
			return this.playTrack(playlist.get('tracks.lastObject'));
		}
		return this.playTrack(next);
	},

	nextRandom() {
		this.get('playerRandom').getNext().then(nextRandom => {
			return this.playTrack(nextRandom);
		});
	},

	// Find out which actual item has to be played
	getNext(array = this.get('playlist.tracks')) {
		return array.objectAt(array.indexOf(this.get('model')) - 1);
	},

	getPrev(array = this.get('playlist.tracks')) {
		return array.objectAt(array.indexOf(this.get('model')) + 1);
	},

	/**
		On YouTube player error
	*/
	onError(error) {
		this.set('isPlaying', false);
		debug(error);
		if (error === 2) {
			// dont do anything on 'invalid parameter'
			return;
		}
		if (error === 150) {
			debug('error150: georestricted track');
		}
		// otherwise skip to next
		this.next();
	},

	/**
		A track ended naturally
		Application route called this.
		A track from the player ended, without user action. It played naturally untill the end
	*/
	trackEnded(finishedTrack = this.get('model')) {
		this.set('isPlaying', false);
		// mark this track has finished
		this.get('playerHistory').trackEnded(finishedTrack);
		// play next track
		return this.next();
	},

	/**
		@method activateRandom
		Random was activated
		from clicking on shuffle in playback
		@TODO from shuffling on a channel card
		1- visualy clear played tracks in the current channel
		2- set pool of tracks to be used
		and return it so we can use it as a promise
	 */

	activateRandom() {
		this.set('isRandom', true);
		this.get('playerHistory').clearPlayerHistory();
		return this.updateRandomPoolFromPlaylist();
	},

	deactivateRandom() {
		debug('deactivateRandom');
		this.set('isRandom', false);
	},

	updateRandomPoolFromPlaylist() {
		return this.get('playlist.tracks').then(items => {
			this.get('playerRandom').setNewRandomPool(items);
		});
	}
});
