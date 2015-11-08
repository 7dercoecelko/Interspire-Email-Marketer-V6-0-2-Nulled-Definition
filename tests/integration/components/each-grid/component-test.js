import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('each-grid', 'Integration | Component | each grid', {
	integration: true
});

test('it renders', function (assert) {
	assert.expect(2);

	// Set any properties with this.set('myProperty', 'value');
	// Handle any actions with this.on('myAction', function(val) { ... });

	this.render(hbs`{{each-grid}}`);

	assert.equal(this.$().text().trim(), '');

	// Template block usage:
	this.set('testItems', ['Michael', 'Jackson']);
	this.render(hbs`
		{{#each-grid items=testItems as |item|}}
			<h2>{{item}}</h2>
		{{/each-grid}}
	`);

	assert.equal(this.$().find('h2:first').text().trim(), 'Michael', 'it can render items');
});
