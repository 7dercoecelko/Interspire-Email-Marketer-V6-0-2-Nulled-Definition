/* eslint camelcase:0 */
import Ember from 'ember'

const { Route, get, set, inject } = Ember

export default Route.extend({
	headData: inject.service(),

	model(params) {
		return this.store
			.query('channel', {
				orderBy: 'slug',
				equalTo: params.channel_slug
			})
			.then(data => data.get('firstObject'))
	},

	afterModel(model) {
		if (!model) {
			this.transitionTo('404')
			return
		}

		// Set meta tags
		const headData = get(this, 'headData')
		const description = model.get('body')
		const slug = model.get('slug')
		set(headData, 'description', description)
		set(headData, 'slug', slug)
		// Because images come from a model relationship…
		model.get('images').then(images => {
			const image = images.get('lastObject.src')
			if (image) {
				set(headData, 'image', image)
			}
		})
	},

	serialize(model) {
		return { channel_slug: model.get('slug') }
	},

	deactivate() {
		// Reset meta tags when leaving the route.
		get(this, 'headData').setProperties({
			description: null,
			image: null,
			slug: null
		})
	}
})
