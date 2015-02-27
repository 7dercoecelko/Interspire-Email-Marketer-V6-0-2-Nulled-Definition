import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	// pages
	this.route('about');
	this.route('forum');
	this.route('help');
	this.route('log');
	this.route('signin');
	this.route('stats');
	this.route('styleguide');
	this.route('dashboard');

	// new channel
	this.route('new');

	// all channels
	this.resource('channels', { path: 'discover'}, function() {
		this.route('popular');
		this.route('all');
	});

	// channel
	this.resource('channel', { path: '/c/:channel_slug' }, function() {
		this.route('edit');
		this.route('favorite-channels');
		this.route('followers');

		// channel tracks
		this.resource('tracks', function() {
			this.route('add');
		});

		// single track
		this.resource('track', { path: ':track_id' });
	});

	// all tracks
	this.resource('tracks', function() {});

	// users
	this.resource('users', function() {
		this.resource('user', { path: '/user/:user_id' });
	});
});

export default Router;
