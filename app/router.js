import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	// pages
	this.route('log');
	this.route('signin');
	this.route('stats');
	this.route('styleguide');
	this.route('dashboard');
	this.route('introduction'); // a tour for newcomers

	// about route
	this.route('about', function() {
		this.route('contact');
		this.route('log');
		this.route('technology');
	});

	// help route
	this.route('help', function() {
	});


	// all channels
	this.resource('channels', { path: '/'}, function() {
		this.route('all');
		this.route('new'); // new channel
	});

	// channel
	this.resource('channel', { path: '/c/:channel_slug' }, function() {
		this.route('index', { path: '/'}, function() {
			this.resource('track', { path: ':track_id' });
		});
		this.route('favorite-channels');
		this.route('followers');
		this.route('edit'); // edit channel
		this.route('add'); // add a track to channel
	});

	// users
	this.resource('users', function() {
		this.resource('user', { path: '/user/:user_id' });
	});
});

export default Router;
