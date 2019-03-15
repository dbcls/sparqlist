const SPARQLetParser = require('./parser');

test('simple', () => {
  const parser = new SPARQLetParser();

  expect(parser.parse(`# hi`)).toEqual({
    title: 'hi',
    params: [],
    procedures: []
  });
});

test('normal', () => {
  const parser = new SPARQLetParser();

  expect(parser.parse(`
# hi

## parameters

- \`foo\` foo parameter
  - default: 42

## endpoint

http://example.org

## \`bar\` Bar bar

\`\`\` js
alert(1);
\`\`\`

## \`baz\` Baz baz

\`\`\` sparql
select distinct * where { ?s ?p ?o . }
\`\`\`
  `)).toEqual({
    title: 'hi',
    params: [
      {
        default: '42',
        name: 'foo',
        description: ' foo parameter',
      },
    ],
    procedures: [
      {
        bindingName: 'bar',
        data: `alert(1);
`,
        name: ' Bar bar',
        type: 'javascript',
      },
      {
        bindingName: 'baz',
        data: `select distinct * where { ?s ?p ?o . }
`,
        name: ' Baz baz',
        type: 'sparql',
        endpoint: 'http://example.org',
      },
    ],
  });
});

test('edge', () => {
  const parser = new SPARQLetParser();

  expect(parser.parse(`
# hi

## parameters

- \`foo\`
  - default: 42_42_42
  `)).toEqual({
    title: 'hi',
    params: [
      {
        default: '42_42_42',
        name: 'foo',
      },
    ],
    procedures: []
  });
});
