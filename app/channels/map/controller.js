import Ember from 'ember';

const {Controller} = Ember;

export default Controller.extend({
	queryParams: ['lat', 'lng', 'zoom'],
	lat: 22.105998799750566,
	lng: 33.04687500000001,
	zoom: 2
});
