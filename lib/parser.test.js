const SPARQLetParser = require('./parser');

let parser;

beforeEach(() => {
  parser = new SPARQLetParser();
});

test('empty', () => {
  expect(parser.parse('')).toEqual({
    title: '',
    params: [],
    procedures: []
  });
});

test('title only', () => {
  expect(parser.parse(`
# hi
# ho
  `)).toEqual({
    title: 'hi',
    params: [],
    procedures: []
  });
});

test('all', () => {
  expect(parser.parse(`
# hi

## parameters

- \`foo\` foo parameter
  - default: 42

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
  `)).toEqual({
    title: 'hi',
    params: [
      {
        default: '42',
        name: 'foo',
        description: 'foo parameter',
      },
    ],
    procedures: [
      {
        bindingName: 'bar',
        name: 'bar procedure',
        data: 'alert(1);',
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
        type: 'javascript',
      },
    ],
  });
});

test('default contains underscores', () => {
  expect(parser.parse(`
# hi

## parameters

- \`foo\`
  - default: 42_42_42
  `)).toEqual({
    title: 'hi',
    params: [
      {
        name: 'foo',
        description: '',
        default: '42_42_42'
      },
    ],
    procedures: []
  });
});

test('endpoint is blank', () => {
  expect(parser.parse(`
# hi

## endpoint

## foo

this is not an endpoint

\`\`\` sparql
select distinct * where { ?s ?p ?o . }
\`\`\`
  `)).toEqual({
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
  expect(parser.parse(`
\`\`\` js
alert(1)
\`\`\`
  `)).toEqual({
    title: '',
    params: [],
    procedures: [
      {
        bindingName: '',
        name: '',
        data: 'alert(1)',
        type: 'javascript'
      }
    ]
  });
});

test('redefine endpoint', () => {
  expect(parser.parse(`
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
  `)).toEqual({
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
  expect(() => {
    parser.parse(`
<br>
    `);
  }).not.toThrow();
});

test('custom element', () => {
  expect(() => {
    parser.parse(`
<x-foo></x-foo>
    `);
  }).not.toThrow();
});
