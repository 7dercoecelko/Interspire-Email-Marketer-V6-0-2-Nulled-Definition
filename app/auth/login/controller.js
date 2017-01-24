import Ember from 'ember';

const {Controller} = Ember;

export default Controller.extend({
	actions: {
		catchLogin(provider, email, password) {
			this.send('login', provider, email, password);
		},
		// Logs in a user.
		// Provider has to match what we've enabled in Firebase authentication.
		// That is: 'password' or 'google' or 'facebook'
		login() {
			console.log('auth.login.controller@login');
			return true;
		}
	}
});
