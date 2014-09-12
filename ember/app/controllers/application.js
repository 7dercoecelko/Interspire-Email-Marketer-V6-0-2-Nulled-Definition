import Ember from 'ember';

export default Ember.Controller.extend({
	needs: ['auth'],

	init: function () {
		// this._super();
	},

	actions: {
		login: function(provider) {
			this.get('controllers.auth').authClient.login(provider);
		},
		logout: function() {
			this.get('controllers.auth').authClient.logout();
		}
	}
});
