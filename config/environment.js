/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'radio4000',
    environment: environment,
    // firebase: 'https://radio4000-dev.firebaseio.com/',
    firebase: 'https://radio4000.firebaseio.com/', // LIVE
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.contentSecurityPolicy = {
    'connect-src': "'self' wss://*.firebaseio.com",
    'frame-src': "'self' https://www.youtube.com https://*.firebaseio.com",
    'script-src': "'self' 'unsafe-eval' https://www.youtube.com/iframe_api https://s.ytimg.com https://*.firebaseio.com"
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  // if (environment === 'production') {
  //   ENV.firebaseURL = 'https://radio4000.firebaseio.com/';
  // }

  return ENV;
};
