import Ember from 'ember';
// import FocusInputComponent from '../focus-input/component';

export default Ember.TextField.extend({
	capturePaste: Ember.on('didInsertElement', function() {
		let self = this;
		let $input = this.$();

		// use jQuery's 'paste' event
		$input.on('paste', function() {

			// without run loop, the pasted value isn't available yet
			// pass the action up!
			Ember.run.schedule('afterRender', function() {
				self.sendAction('pasted', $input.val());
			});
		});
	})
});
