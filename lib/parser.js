const commonmark = require('commonmark');

module.exports = class SPARQLetParser {
  parse(markdown) {
    const walker = commonmark.Parser().parse(markdown.toString()).walker();

    return parseTree(walker);
  }
};

function parseTree(walker, title = null, params = [], endpoint = null, procedures = [], nextProcedureProps = {}) {
  const event = walker.next();

  if (!event) {
    return {
      title,
      params,
      procedures
    };
  }

  const {node, entering} = event;

  if (node.type === 'heading' && entering) {
    const events  = readToLeaving(walker, 'heading', 1);
    const heading = pluckLiteral(events, 'text') || '';

    if (node.level === 1) {
      const _title = heading;

      return parseTree(walker, _title, params, endpoint, procedures, nextProcedureProps);
    }

    if (heading.toLowerCase() === 'parameters') {
      const _params = extractParams(readToLeaving(walker, 'list'));

      return parseTree(walker, title, _params, endpoint, procedures, nextProcedureProps);
    }

    if (heading.toLowerCase() === 'endpoint') {
      const _endpoint = pluckLiteral(readToLeaving(walker, 'paragraph'), 'text');

      return parseTree(walker, title, params, _endpoint, procedures, nextProcedureProps);
    }

    const _nextProcedureProps = {
      name:        heading,
      bindingName: pluckLiteral(events, 'code')
    };

    return parseTree(walker, title, params, endpoint, procedures, _nextProcedureProps);
  }

  if (node.type === 'code_block' && entering) {
    if (node.info === 'sparql') {
      const procedure = Object.assign(nextProcedureProps, {
        type: 'sparql',
        data: node.literal,
        endpoint
      });

      return parseTree(walker, title, params, endpoint, procedures.concat(procedure), {});
    }

    if (node.info === 'js' || node.info === 'javascript') {
      const procedure = Object.assign(nextProcedureProps, {
        type: 'javascript',
        data: node.literal
      });

      return parseTree(walker, title, params, endpoint, procedures.concat(procedure), {});
    }
  }

  return parseTree(walker, title, params, endpoint, procedures, nextProcedureProps);
}

function readToLeaving(walker, type, depth = 0, events = []) {
  const event = walker.next();

  if (!event) { return events; }

  events = events.concat(event);

  const {node, entering} = event;

  if (node.type !== type) {
    return readToLeaving(walker, type, depth, events);
  }

  if (entering) {
    return readToLeaving(walker, type, depth + 1, events);
  } else if (depth === 1) {
    return events;
  } else {
    return readToLeaving(walker, type, depth - 1, events);
  }
}

function pluckLiteral(events, type) {
  const event = events.find(({node}) => node.type === type && node.literal);

  return event ? event.node.literal : null;
}

function extractParams(events) {
  const {params} = events.reduce(({params, memo}, {node, entering}) => {
    if (node.type === 'item' && !entering) {
      return {
        params: memo.name ? params.concat(memo) : params,
        memo:   {}
      };
    }

    if (node.type === 'code') {
      return {
        params,
        memo: Object.assign(memo, {name: node.literal})
      };
    }

    if (node.type === 'text') {
      if (node.literal.startsWith('default:')) {
        return {
          params,
          memo: Object.assign(memo, {default: node.literal.replace(/^default:\s*/, '')})
        };
      } else {
        return {
          params,
          memo: Object.assign(memo, {description: node.literal})
        };
      }
    }

    return {params, memo};
  }, {params: [], memo: {}});

  return params;
}
