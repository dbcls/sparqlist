import assert from 'node:assert/strict';
import test from 'node:test';

import SPARQLetParser from '../lib/parser.mjs';

function parse(markdown) {
  return new SPARQLetParser().parse(markdown);
}

test('empty', () => {
  assert.deepStrictEqual(parse(''), {
    title: '',
    params: [],
    procedures: []
  });
});

test('title only', () => {
  assert.deepStrictEqual(parse(`
# hi
# ho
  `), {
    title: 'hi',
    params: [],
    procedures: []
  });
});

test('all', () => {
  assert.deepStrictEqual(parse(`
# hi

## parameters

- \`foo\` foo parameter
  - default: 42
  - example: foo example

## Endpoint

http://example.org

## \`bar\` bar procedure

\`\`\` js
alert(1);
\`\`\`

## \`baz\`

\`\`\` sparql
select distinct * where { ?s ?p ?o . }
\`\`\`

## quux procedure

\`\`\` javascript
alert(2);
\`\`\`
  `), {
    title: 'hi',
    params: [
      {
        default: '42',
        name: 'foo',
        description: 'foo parameter',
        example: 'foo example'
      },
    ],
    procedures: [
      {
        bindingName: 'bar',
        name: 'bar procedure',
        data: 'alert(1);',
        endpoint: undefined,
        type: 'javascript',
      },
      {
        bindingName: 'baz',
        name: '',
        data: 'select distinct * where { ?s ?p ?o . }',
        type: 'sparql',
        endpoint: 'http://example.org',
      },
      {
        bindingName: '',
        name: 'quux procedure',
        data: 'alert(2);',
        endpoint: undefined,
        type: 'javascript',
      },
    ],
  });
});

test('default contains underscores', () => {
  assert.deepStrictEqual(parse(`
# hi

## parameters

- \`foo\`
  - default: 42_42_42
  `), {
    title: 'hi',
    params: [
      {
        name: 'foo',
        description: '',
        default: '42_42_42',
        example: ''
      },
    ],
    procedures: []
  });
});

test('default contains asterisks', () => {
  assert.deepStrictEqual(parse(`
# hi

## parameters

- \`foo\`
  - default: 42*42*42
  `), {
    title: 'hi',
    params: [
      {
        name: 'foo',
        description: '',
        default: '424242',
        example: ''
      },
    ],
    procedures: []
  });
});

test('default contains inline code', () => {
  assert.deepStrictEqual(parse(`
# hi

## parameters

- \`foo\`
  - default: \`42*42*42\`
  `), {
    title: 'hi',
    params: [
      {
        name: 'foo',
        description: '',
        default: '42*42*42',
        example: ''
      },
    ],
    procedures: []
  });
});

test('endpoint is blank', () => {
  assert.deepStrictEqual(parse(`
# hi

## endpoint

## foo

this is not an endpoint

\`\`\` sparql
select distinct * where { ?s ?p ?o . }
\`\`\`
  `), {
    title: 'hi',
    params: [],
    procedures: [
      {
        bindingName: '',
        name: 'foo',
        data: 'select distinct * where { ?s ?p ?o . }',
        type: 'sparql',
        endpoint: '',
      }
    ]
  });
});

test('procedure without heading', () => {
  assert.deepStrictEqual(parse(`
\`\`\` js
alert(1)
\`\`\`
  `), {
    title: '',
    params: [],
    procedures: [
      {
        bindingName: '',
        name: '',
        data: 'alert(1)',
        endpoint: undefined,
        type: 'javascript'
      }
    ]
  });
});

test('redefine endpoint', () => {
  assert.deepStrictEqual(parse(`
## endpoint
http://ep1

## query 1
\`\`\` sparql
# query 1
\`\`\`

## endpoint
http://ep2

## query 2
\`\`\` sparql
# query 2
\`\`\`
  `), {
    title: '',
    params: [],
    procedures: [
      {
        bindingName: '',
        name: 'query 1',
        data: '# query 1',
        type: 'sparql',
        endpoint: 'http://ep1'
      },
      {
        bindingName: '',
        name: 'query 2',
        data: '# query 2',
        type: 'sparql',
        endpoint: 'http://ep2'
      }
    ]
  });
});

test('html', () => {
  assert.deepStrictEqual(parse(`
<h1>Hi</h1>

<h2>foo</h2>

\`\`\` js
alert(1)
\`\`\`
  `), {
    title: 'Hi',
    params: [],
    procedures: [
      {
        bindingName: '',
        name: 'foo',
        data: 'alert(1)',
        endpoint: undefined,
        type: 'javascript'
      }
    ]
  });
});

test('custom element', () => {
  assert.deepStrictEqual(parse(`
# hi

<foo-bar></foo-bar>
  `), {
    title: 'hi',
    params: [],
    procedures: []
  });
});
