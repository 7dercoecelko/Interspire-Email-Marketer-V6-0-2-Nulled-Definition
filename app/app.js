import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
	modulePrefix: config.modulePrefix,
	Resolver: Resolver
});

// Change the class used on active elements by Ember
Ember.LinkView.reopen({
	activeClass: 'is-active'
});

loadInitializers(App, config.modulePrefix);

export default App;
