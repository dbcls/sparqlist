const commonmark = require('commonmark');

function parseTree(walker, title = null, params = [], procedures = [], lastProcedureSpec = {}) {
  const event = walker.next();

  if (!event) {
    return {
      title,
      params,
      procedures
    };
  }

  const node = event.node;

  if (node.type === 'heading' && event.entering) {
    const events  = readToLeaving(walker, 'heading', 1);
    const heading = pluckLiteral(events, 'text');

    if (node.level === 1) {
      return parseTree(walker, heading, params, procedures, lastProcedureSpec);
    } else if (heading.toLowerCase() === 'parameters') {
      const {params} = readToLeaving(walker, 'list').reduce(({work, params}, ev) => {
        if (ev.node.type === 'item' && !ev.entering) {
          return {
            work: {},
            params:  work.name ? params.concat(work) : params
          };
        } else if (ev.node.type === 'code') {
          return {
            work: Object.assign(work, {name: ev.node.literal}),
            params
          };
        } else if (ev.node.type === 'text') {
          if (ev.node.literal.startsWith('default:')) {
            return {
              work: Object.assign(work, {default: ev.node.literal.replace(/^default:\s*/, '')}),
              params
            };
          } else {
            return {
              work: Object.assign(work, {description: ev.node.literal}),
              params
            };
          }
        } else {
          return {work, params};
        }
      }, {work: {}, params: []});

      return parseTree(walker, title, params, procedures, lastProcedureSpec);
    } else if (heading.toLowerCase() === 'endpoint') {
      return parseTree(walker, title, params, procedures, Object.assign(lastProcedureSpec, {
        endpoint: pluckLiteral(readToLeaving(walker, 'paragraph'), 'text')
      }));
    } else {
      const bindingName = pluckLiteral(events, 'code');

      if (bindingName) {
        return parseTree(walker, title, params, procedures, Object.assign(lastProcedureSpec, {
          bindingName,
          name: pluckLiteral(events, 'text')
        }));
      } else {
        return parseTree(walker, title, params, procedures, lastProcedureSpec);
      }
    }
  } else if (node.type === 'code_block' && event.entering) {
    switch (node.info) {
      case 'sparql':
        return parseTree(walker, title, params, procedures.concat({
          type:        'sparql',
          data:        node.literal,
          bindingName: lastProcedureSpec.bindingName,
          name:        lastProcedureSpec.name,
          endpoint:    lastProcedureSpec.endpoint,
        }), {
          endpoint: lastProcedureSpec.endpoint
        });
      case 'js':
      case 'javascript':
        return parseTree(walker, title, params, procedures.concat({
          type:        'javascript',
          data:        node.literal,
          bindingName: lastProcedureSpec.bindingName,
          name:        lastProcedureSpec.name,
        }), {
          endpoint: lastProcedureSpec.endpoint
        });
    }
  } else {
    return parseTree(walker, title, params, procedures, lastProcedureSpec);
  }
}

function pluckLiteral(events, type) {
  const event = events.find(({node}) => node.type === type && node.literal);

  return event ? event.node.literal : null;
}

function readToLeaving(walker, type, depth = 0, events = []) {
  const event = walker.next();

  if (!event) {
    return events;
  } else if (event.node.type === type && !event.entering) {
    return depth === 1 ? events.concat(event) : readToLeaving(walker, type, depth - 1, events.concat(event));
  } else if (event.node.type === type && event.entering) {
    return readToLeaving(walker, type, depth + 1, events.concat(event));
  } else {
    return readToLeaving(walker, type, depth, events.concat(event));
  }
}

module.exports = class SPARQLetParser {
  constructor() {
  }

  parse(markdown) {
    const tree   = commonmark.Parser().parse(markdown.toString());
    const walker = tree.walker();

    return parseTree(walker);
  }
};
