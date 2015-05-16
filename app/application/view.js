import Ember from 'ember';

export default Ember.View.extend({
	classNames: ['BreadAndCheese'],
	classNameBindings: [
		'controller.isFullscreen',
		'controller.player.model::is-withoutPlayer',
		'controller.isPanelOpen:is-panelOpen',
		'controller.isMinimalUi:is-minimalUi',
		'controller.isMinimalUiAnimation:is-minimalUiAnimation'
	],

	didInsertElement() {
		const self = this;

		// Remove our dummy app with inline styles
		Ember.$('.DummyApp').remove();

		// close on top bar, links in the panel nav and on the overlay
		this.$().on('click.app', '.SiteLogo, .PanelNav a, .PanelNav-overlay', function() {
			Ember.run.schedule('afterRender', () => {
				self.set('controller.isPanelOpen', false);
			});
		});
	},

	willDestroyElement() {
		this.$().off('click.app');
	}
});
