import Ember from 'ember';

export default Ember.Route.extend({

	// Abort if user isn't allowed to edit
	beforeModel: function() {
		var canEdit = this.controllerFor('channel').get('canEdit');
		if (!canEdit) { this.transitionTo('channel', this.modelFor('channel')); }
	},

	// clear any unsaved changes
	deactivate: function() {
		this.controllerFor('channel').get('model').rollback();
	}
});
