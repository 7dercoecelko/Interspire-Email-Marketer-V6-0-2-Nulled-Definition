import Ember from 'ember';

const {Controller, computed, observer, run} = Ember;

// Returns true if {string} contains {search}
const stringContains = function (string, search) {
	if (!string) {
		return false;
	}

	return string.toLowerCase().indexOf(search.toLowerCase()) >= 0;
};

export default Controller.extend({
	search: '',
	queryParams: ['search'],
	isGrid: true,

	// This little pattern makes sets a property maximum every X ms for performance.
	watchSearch: observer('search', function () {
		run.throttle(this, this.runSearch, 500);
	}),

	// The property triggers the computed property to, well, compute!
	runSearch() {
		this.set('realSearch', this.get('search'));
	},

	// filteredChannels: computed.filter('model', function (channel) {
	// 	return channel.get('coverImage');
	// }),

	// Filters out models where title or body matches the search
	// it watches 'realSearch' instead of 'search' so we can
	// debounce for performance.
	channels: computed('realSearch', 'model', function () {
		let search = this.get('search');
		let model = this.get('model');

		if (!search) {
			return model;
		}

		return model.filter(item => {
			return stringContains(item.get('title'), search) || stringContains(item.get('body'), search);
		});
	}),

	sortKeys: ['created:desc'],
	sortedChannels: computed.sort('channels', 'sortKeys'),

	actions: {
		toggleGrid() {
			this.toggleProperty('isGrid');
		}
	}
});
