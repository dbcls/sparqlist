'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: ['node_modules'],
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
  app.import('node_modules/codemirror/lib/codemirror.css');
  app.import('node_modules/codemirror/theme/base16-light.css');

  return app.toTree();
};
