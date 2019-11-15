'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    'no-curly-component-invocation': {
      allow: [
        'or',
        'path-to-url',
        'to-json',
      ]
    },
    'no-implicit-this': {
      allow: [
        '_',
      ]
    }
  }
};
