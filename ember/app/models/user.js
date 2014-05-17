/* global md5 */
var User = DS.Model.extend({
	name: DS.attr('string'),
	created: DS.attr('number'),
	playlists: DS.hasMany('playlist', { async: true }),

	username: function() {
		return this.get('id');
	}.property(),

	avatar: function() {
		return 'https://www.gravatar.com/avatar/' + md5(this.get('id')) + '.jpg?d=retro&size=80';
	}.property()
});

export default User;
