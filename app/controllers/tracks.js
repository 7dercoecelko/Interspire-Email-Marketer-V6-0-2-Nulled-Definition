import Ember from 'ember';

export default Ember.ArrayController.extend({
	// steal the edit property from the channel
	needs: ['channel', 'playback', 'track'],
	canEdit: Ember.computed.alias('controllers.channel.canEdit'),
	playback: Ember.computed.alias('controllers.playback'),
	track: Ember.computed.alias('controllers.track'),

	currentTrackComponent: null,

	// Sort by newest on top
	sortProperties: ['created'],
	sortAscending: false

	// ,
	// actions: {
	// 	// sortBy: function(property) {
	// 	// 	this.set('sortProperties', [property]);
	// 	// 	this.set('sortAscending', !this.get('sortAscending'));
	// 	// }
	// }
});
