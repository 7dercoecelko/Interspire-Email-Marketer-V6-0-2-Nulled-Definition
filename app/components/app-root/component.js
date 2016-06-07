/* global document */
import Ember from 'ember';
const {Component, inject, run} = Ember;

export default Component.extend({
	uiStates: inject.service(),
	player: inject.service(),

	classNames: ['Root'],
	classNameBindings: [
		'uiStates.player.isMaximized:is-maximized',
		'isEmbed',
		'isInverted',
		'uiStates.player.isMinimized:is-minimized',
		'uiStates.isMinimal',
		'uiStates.isPanelLeftVisible:is-panelLeftVisible',
		'player.model:is-withPlayer:is-withoutPlayer'
	],

	didInsertElement() {
		run.scheduleOnce('afterRender', () => {
			this.removeDummyHTML();
		});
	},

	// Remove our dummy app with inline styles.
	removeDummyHTML() {
		const dummy = document.querySelector('.DummyApp');
		if (!dummy) {
			return;
		}
		dummy.parentNode.removeChild(dummy);
	}
});
