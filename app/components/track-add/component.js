import Ember from 'ember';
import TrackFormComponent from 'radio4000/components/track-form/component';
import config from 'radio4000/config/environment';

const {debug, observer, on, run} = Ember;

export default TrackFormComponent.extend({
	// By passing a `newUrl` property to this component,
	// we'll here set it to `track.url` (needed for ?add=queryParams)
	init() {
		// Create a track object that we later turn it to real track model
		const url = this.get('newUrl');
		this.set('track', {url});
		this._super(...arguments);
	},

	// This gets called when you paste something into the input-url component
	// it takes a URL and turns it into a YouTube ID which we use to query the API for a title
	automaticSetTitle: on('init', observer('track.url', function () {
		const url = this.get('track.url');
		const ytid = this.getYoutubeId(url);

		if (!ytid) {
			debug('no ytid');
			return;
		}

		this.set('youtubeId', ytid);

		// call setTitle but throttle it so it doesn't happen on every key-stroke
		run.throttle(this, this.setTitle, 1000);
	})),

	setTitle() {
		const id = this.get('youtubeId');
		const endpoint = `https://www.googleapis.com/youtube/v3/videos?
			id=${id}
			&key=${config.youtubeApiKey}
			&fields=items(id,snippet(title))
			&part=snippet`;

		// Use cache if we have it
		if (this.get('cachedId') === id) {
			debug('Setting cached title');
			this.set('track.title', this.get('cachedTitle'));
			return;
		}

		this.set('isFetchingTitle', true);

		Ember.$.getJSON(endpoint).then(response => {
			this.set('isFetchingTitle', false);

			if (!response.items.length) {
				debug('Could not find a title');
				return;
			}

			const title = response.items[0].snippet.title;
			this.set('track.title', title);

			// cache our title and ID so we don't request the same video twice
			this.set('cachedTitle', title);
			this.set('cachedId', id);
		});
	}
});

// @todo save this, DONT DELETE THIS!
// this could get called from our youtube-search component
// addFromSearch(item) {
// 	let title = item.get('title');
// 	let url = item.get('url');
//
// 	// clean the url
// 	url = url.replace('&feature=youtube_gdata_player', '');
//
// 	// update current model with properties from the chosen search
// 	this.set('title', title);
// 	this.set('url', url);
// }
