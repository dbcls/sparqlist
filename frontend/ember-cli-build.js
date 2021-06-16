'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: ['node_modules'],
    },
    codemirror: {
      modes: ['markdown', 'javascript', 'sparql'],
      themes: ['base16-light'],
    },
    autoImport: {
      webpack: {
        resolve: {
          fallback: { path: require.resolve('path-browserify') },
        },
      },
    },
  });

  app.import('node_modules/jquery/dist/jquery.slim.js');
  app.import('node_modules/bootstrap/dist/js/bootstrap.bundle.js');

  return app.toTree();
};
