import Ember from 'ember';
import PlayButtonComponent from 'radio4000/components/play-btn/component';

const {computed} = Ember;

// Extends the play button with a different title and template

export default PlayButtonComponent.extend({
	attributeBindings: ['title'],
	title: computed('isShuffled', function () {
		return this.get('isShuffled') ? 'Skip current track (press "S")' : 'Play this radio';
	})
});
