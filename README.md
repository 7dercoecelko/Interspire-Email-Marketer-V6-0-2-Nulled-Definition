# Radio4000

This is an Ember.js application scaffolded with ember-cli.

## How to install

Please follow this guide step-by-step to make sure everything works. It assumes you're on OS X with node installed.

### Install Radio4000 dependencies

First install Ember CLI, which is used as development server and to build the project.

`npm install -g ember-cli`

then clone the project repository and install it

```
git clone https://github.com/hugovieilledent/radio4000.git
cd radio4000
npm install
bower install
```

## Watching and testing

- `ember s`  (short for `ember serve`, opens a dev server at 0.0.0.0:4000)
- `ember test`

Also see http://www.ember-cli.com/

## Updating sprite, new icons - svg only

- go to public/images/icons
- open sprite.svg in code editor
- look how things are made
- paste in your new svg icon

## Building and deploying

First build it:

- `$ ember build` (build will still include logs, warnings etc. for testing)
- `$ ember build --environment=production` (hard to debug, only use this when it's ready for deploy)

Then deploy:

`$ gulp deploy-dev` (dev.radio4000.com)
`$ gulp deploy-live` (radio4000.com)

## Using our CDN

To serve a file from our CDN, prepend the file of the URL (from our live domain radio4000.com) with `http://dyzwdli7efbh5.cloudfront.net` and it'll automatically pull and serve the file from the CDN.

## Building native apps

First, make sure production environment in `config/environment.js` looks like this:

```javascript
if (environment === 'electron') {
  ENV.baseURL = './';
  ENV.locationType = 'hash';
  ENV.firebase = 'https://radio4000.firebaseio.com/';
}
```

… then run:

```
gulp electron
```

Check the dist folder where you'll now have all the apps. Be sure to change environment back afterwards.

## Important if you use Sublime Text

Sublime automatically watches all files in a folder. Because ember-cli is so huge your PC will slow down. To solve this, tell Sublime to ignore the `tmp` and `node_modules` folder: http://www.ember-cli.com/#sublime-text

## Emberfire

We use Firebase as our backend through Ember Data and [Emberfire](https://github.com/firebase/emberfire).

## Google API

We're using the YouTube API so you might run into trouble with permissions, domains etc. If so, check here https://console.developers.google.com/project/much-play/

## Firebase security rules

Firebase rules are a bitch. With the [Blaze Compiler](https://github.com/firebase/blaze_compiler) it's supposed to be easier, so:

```
$ npm install -g blaze_compiler
$ blaze rules/rules.yaml
```

## How to update ember-cli

Follow the instructions on [ember-cli/releases](https://github.com/ember-cli/ember-cli/releases) and remember to keep our own dependencies:

```
npm install --save-dev ember-modal-dialog ember-cli-sass broccoli-csso ember-cli-app-version ember-cli-autoprefixer gulp rsyncwrapper emberfire ember-youtube torii torii-fire
npm uninstall ember-cli-content-security-policy
```

Remove `ember-cli-content-security-policy` if it's in `package.json`.
