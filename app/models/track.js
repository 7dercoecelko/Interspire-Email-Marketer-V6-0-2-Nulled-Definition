import Ember from 'ember';
import DS from 'ember-data';
import youtube from 'radio4000/utils/youtube';

export default DS.Model.extend({
	url: DS.attr('string'),
	title: DS.attr('string'),
	body: DS.attr('string'),
	created: DS.attr('number', {
		defaultValue() { return new Date().getTime(); }
	}),
	ytid: DS.attr('string'),

	// relationships
	channel: DS.belongsTo('channel', { async: true, inverse: 'tracks' }),

	// Returns a YouTube ID from an URL
	// TODO: this should definitely be saved in the db
	// and not computed every time like it is now
	updateProvider() {
		let id = youtube(this.get('url'));

		Ember.debug('updateYtid');
		this.set('ytid', id);
		this.save();
	}

	// // Finds an array of all " #hashtags " from the body property
	// hashtags: Ember.computed('body', function() {
	// 	let body = this.get('body');
	// 	let hashtags;

	// 	if (!body) { return; }

	// 	// find " #hashtags" (with space) https://regex101.com/r/pJ4wC5/4
	// 	hashtags = body.match(/(^|\s)(#[a-z\d-]+)/ig);

	// 	if (!hashtags) { return; }

	// 	// remove spaces on each item
	// 	return hashtags.map((tag) => tag.trim());
	// })

	// bodyPlusMentions: function() {
	// 	let body = this.get('body');
	// 	// find " @channel" (with space)
	// 	return body.replace(/(^|\s)(@[a-z\d-]+)/ig,'$1<a href="http://radio4000.com/c/$2" class="Mention">$2</a>');
	// }.property('body')
});
