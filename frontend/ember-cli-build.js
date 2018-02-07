'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: [
        'node_modules'
      ]
    },
    codemirror: {
      modes: ['markdown'],
      themes: ['base16-light'],
    }
  });

  app.import('node_modules/bootstrap/dist/js/bootstrap.bundle.js');

  return app.toTree();
};
