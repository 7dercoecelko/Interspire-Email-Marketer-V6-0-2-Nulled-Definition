import Ember from 'ember';
import randomHelpers from 'radio4000/mixins/random-helpers';

const {Service, inject, computed, debug} = Ember;

export default Service.extend(randomHelpers, {
	player: inject.service(),

	// Pool of shuffled tracks: those availabled to be picked form
	randomPool: [],
	// which one are we currently playing
	randomIndex: 0,
	canPrevious: computed.bool('randomIndex'),

	// sets a new random pool from the playlist in the player
	// takes the player array and shuffles it
	setNewRandomPool(items) {
		let shuffledItems = [];
		items.forEach(item => {
			shuffledItems.pushObject(item);
		});
		this.set('randomPool', this.shuffle(shuffledItems));
	},

	// manages what to do when random has to be refreshed/reset
	refreshRandom() {
		debug('refreshRandomPool started');
		// @TODO clear all tracks.usedInCurrentPlayer
		this.get('player').clearPlayerHistory();
		this.setNewRandomPool();
	},
	shuffleSequenceIsFinished() {
		debug('shuffleSequenceIsFinished');
		this.get('player').randomEnded();
	},

	/**
	 @method
	 @returns @track model that has to be played, to the player@nextRandom
	 @param {pool} array of tracks available to be played
	*/
	getNext(array = this.get('randomPool')) {
		let item = array.objectAt(array.indexOf(this.get('player.model')) + 1);
		if (!item) {
			return array.objectAt(0);
		}
		return item;
	},

	/**
		@method getPrevious
		@returns the track previously played in random mode
	*/
	getPrevious(array = this.get('randomPool')) {
		console.log('get prevvzz');
		let item = array.objectAt(array.indexOf(this.get('player.model')) - 1);
		if (!item) {
			return array.objectAt(array.length - 1);
		}
		return item;
	}
});
