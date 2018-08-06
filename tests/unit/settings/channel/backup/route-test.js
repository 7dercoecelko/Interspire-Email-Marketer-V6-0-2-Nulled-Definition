import {module, test} from 'qunit'
import {setupTest} from 'ember-qunit'

module('Unit | Route | settings/channel/backup', function(hooks) {
	setupTest(hooks)

	test('it exists', function(assert) {
		let route = this.owner.lookup('route:settings/channel/backup')
		assert.ok(route)
	})
})
