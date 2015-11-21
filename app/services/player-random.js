import Ember from 'ember';
import randomHelpers from 'radio4000/mixins/random-helpers';

const {Service, A, inject, computed, observer, debug} = Ember;

export default Service.extend(randomHelpers, {
	player: inject.service(),
	isRandom: false,

	// Pool of available = all track to be listened to
	randomPool: new A([]),

	randomWasActivated: observer('isRandom', 'player.playlist.model', function () {
		if (this.get('isRandom')) {
			debug('randomWasActivated: new channel to random');
			this.setRandomPool();
		}
	}),
	setRandomPool() {
		let array = this.get('player.playlist.tracks');
		this.set('randomPool', array.slice(0));
	},
	refreshRandomPool() {
		// @TODO clear all tracks.usedInCurrentPlayer
		this.get('player').clearPlayedTracksStatus();
		this.setRandomPool();
	},

	/**
	 @method
	 @returns @track model that has to be played, to the player@nextRandom
	 @param {pool} array of tracks available to be played
	*/
	getRandom(pool = this.get('randomPool')) {
		debug('getRandom started');

		// get random number to get random track
		let poolLength = pool.get('length');

		// if no object in pool, refresh it
		if (!poolLength) {
			debug('pool is empty!');
			this.refreshRandomPool();
			this.getRandom();
		}

		// otherwise, find a random track in the pool and return it to nextRandom
		let randomNumberInPool = this.randomNumberInArray(poolLength);
		let randomTrackInPool = pool.objectAt(randomNumberInPool);

		console.log('- poolLength:', poolLength, 'randomNumberInPool:', randomNumberInPool);

		this.get('randomPool').removeObject(randomTrackInPool);

		return randomTrackInPool;
	}
});
