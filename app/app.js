/* global ga */
import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
	rootElement: '#Radio4000',
	modulePrefix: config.modulePrefix,
	podModulePrefix: config.podModulePrefix,
	Resolver: Resolver
});

// Change the class Ember adds to active elements
Ember.LinkComponent.reopen({
	activeClass: 'is-active'
});

Ember.EventDispatcher.reopen({
	setup() {
		const ignoreEvents = ['touchmove', 'touchstart', 'touchend', 'touchcancel', 'mousemove', 'mouseenter', 'mouseleave'];
		let events = this.get('events');

		Ember.$.each(ignoreEvents, function (index, value) {
			events[value] = null;
			delete events[value];
		});

		this.set('events', events);

		return this._super(Array.prototype.slice.call(arguments));
	}
});

loadInitializers(App, config.modulePrefix);

export default App;
