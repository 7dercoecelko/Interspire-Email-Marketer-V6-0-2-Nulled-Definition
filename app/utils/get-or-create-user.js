import Ember from 'ember';

const {RSVP: {Promise}} = Ember;

export function createUserSetting(user, store) {
	if (!user) {
		throw new Error('Missing `user` argument');
	}
	if (user.get('settings')) {
		console.log('Can not create user setting. Already exists.');
		return Promise.resolve(user.get('settings.firstObject'));
	}
	const userSetting = this.get('store').createRecord('user-setting', {user});
	return Promise(resolve => {
		userSetting.save().then(() => {
			user.set('settings', userSetting);
			user.save().then(() => resolve(userSetting));
		});
	});
}

export function getOrCreateUser(id, store) {
	if (!id) {
		throw new Error('Missing `id` argument');
	}
	if (!store) {
		throw new Error('Missing `store` argument');
	}
	return new Promise(resolve => {
		store.findRecord('user', id).then(user => {
			resolve(user);
		}).catch(error => {
			console.log(error);
			const newUser = store.createRecord('user', {id});
			newUser.save().then(() => {
				resolve(newUser);
			});
		});
	});
}
