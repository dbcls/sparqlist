'use strict';

module.exports = {
  extends: 'recommended',
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
