import Ember from 'ember';
import DS from 'ember-data';

const {attr, hasMany, belongsTo} = DS;
const {computed} = Ember;

/*
 Channel model
 There is no reference to the 'channel owner' because we want the user to be as anonymous as possible.
 There is also a channelPublic model, which can be edited by anyone.
 */

export default DS.Model.extend({
	title: attr('string'),
	slug: attr('string'),
	body: attr('string'),
	isFeatured: attr('boolean'),
	link: attr('string'),

	// Timestamps.
	created: attr('number', {
		defaultValue() {
			return new Date().getTime();
		}
	}),
	updated: attr('number', {
		defaultValue() {
			return new Date().getTime();
		}
	}),

	// Set the latest image as the cover image.
	coverImage: computed('images.[]', function () {
		return this.get('images.lastObject');
	}),

	// This property is toggled by the player setChannel.
	isInPlayer: false,

	// Relationships.
	images: hasMany('image', {async: true}),
	tracks: hasMany('track', {async: true}),
	favoriteChannels: hasMany('channel', {inverse: null, async: true}),
	channelPublic: belongsTo('channelPublic', {async: true})
});
