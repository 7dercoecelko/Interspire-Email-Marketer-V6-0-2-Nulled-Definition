import Ember from 'ember';
import clean from 'radio4000/utils/clean';
import randomText from 'radio4000/utils/random-text';
import channelConst from 'radio4000/utils/channel-const';
import EmberValidations from 'ember-validations';
import {task} from 'ember-concurrency';

const {debug, computed, get} = Ember;

export default Ember.Controller.extend(EmberValidations, {
	title: '',
	isSaving: false,

	// form validation
	validations: {
		title: {
			length: {
				minimum: channelConst.titleMinLength,
				maximum: channelConst.titleMaxLength
			}
		}
	},
	// errors from form validation
	showErrors: false,

	// cleans the slug from bad things and suffix it with a random string
	cleanSlug: computed('title', function () {
		const title = clean(this.get('title'));
		const random = randomText();
		return `${title}-${random}`;
	}),

	createRadio: task(function * () {
		const messages = get(this, 'flashMessages');
		const user = get(this, 'session.currentUser');
		const slug = get(this, 'cleanSlug');
		let title = get(this, 'title');

		// Avoid extra spaces
		title = title.trim();

		// Save the channel, create channel public and relationships, save again
		const channel = this.store.createRecord('channel', {title, slug});
		yield channel.save();

		const userChannels = yield user.get('channels');
		userChannels.addObject(channel);
		yield user.save();

		const channelPublic = yield this.store.createRecord('channelPublic', {channel});
		yield channelPublic.save();

		try {
			channel.setProperties({channelPublic});
			yield channel.save();
		} catch (e) {
			throw new Error('Could not save new channel');
		} finally {
			this.transitionToRoute('channel', channel);
		}
	}).drop(),

	actions: {
		submit() {
			this.validate().then(() => {
				get(this, 'createRadio').perform();
			}).catch(() => {
				this.set('showErrors', true);
				debug('Form does not validate');
			});
		}
	}
});
