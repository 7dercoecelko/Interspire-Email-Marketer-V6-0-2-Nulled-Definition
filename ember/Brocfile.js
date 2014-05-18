/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var p = require('ember-cli/lib/preprocessors');
var preprocessCss = p.preprocessCss;
var autoprefixer = require('broccoli-autoprefixer');

var app = new EmberApp({
  name: require('./package.json').name,

  minifyCSS: {
    enabled: true,
    options: {}
  },

  getEnvJSON: require('./config/environment')
});

app.styles = function() {
  //compiling less to css
  var styles =  preprocessCss(this.appAndDependencies(), this.name + '/styles', '/assets');
  //applying autoprefixer on styles
  styles = autoprefixer(styles,['> 1%', 'last 2 versions']);
  return styles;
};

// Use this to add additional libraries to the generated output files.
app.import('vendor/ember-data/ember-data.js');
app.import('vendor/emberfire/dist/emberfire.min.js');
app.import('vendor/firebase/firebase.js');
app.import('vendor/firebase-simple-login/firebase-simple-login-debug.js');
app.import('vendor/markdown/lib/markdown.js');
app.import('vendor/moment/moment.js');
app.import('vendor/js-md5/js/md5.js');

// If the library that you are including contains AMD or ES6 modules that
// you would like to import into your application please specify an
// object with the list of modules as keys along with the exports of each
// module as its value.
app.import('vendor/ic-ajax/dist/named-amd/main.js', {
  'ic-ajax': [
    'default',
    'defineFixture',
    'lookupFixture',
    'raw',
    'request',
  ]
});

module.exports = app.toTree();
