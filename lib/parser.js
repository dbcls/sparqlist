const marked = require('marked');
const _ = require('lodash');

class HeadingTracker {
  constructor() {
    this.headings = [];
  }

  handle(depth, text) {
    const d = depth - 1;
    this.headings = this.headings.slice(0, d);
    this.headings[d] = text;
  }

  latestHeadingText() {
    return this.headings.slice(-1)[0] || '';
  }

  isInSection(text) {
    const t = this.latestHeadingText();
    return t && t.toLowerCase() === text;
  }

  bindingName() {
    const nameMatch = this.latestHeadingText().match(/`([^`]*)`/);
    return nameMatch ? nameMatch[1] : undefined;
  }
}

class ParametersTracker {
  constructor() {
    this.stack = [];
    this.params = [];
  }

  handle(type, text) {
    switch (type) {
    case 'list_start':
      this.stack.push('list');
      break;
    case 'list_item_start':
      this.stack.push('item');
      break;
    case 'list_end':
      this.stack.pop();
      break;
    case 'list_item_end':
      this.stack.pop();
      if (_.isEqual(this.stack, ['list']) && this.param) {
        this.params.push(this.param);
        this.param = undefined;
      }
      break;
    }
    if (_.isEqual(this.stack, ['list', 'item']) && type === 'text') {
      const m = text.match(/^`([^`]*)`\s*(.*)$/, '');
      if (m) {
        this.param = {
          name: m[1],
          description: m[2]
        };
      }
    } else if(_.isEqual(this.stack, ['list', 'item', 'list', 'item']) && type === 'text') {
      const m = text.match(/^default: (.*)$/, '');
      if (m) {
        this.param.default = m[1];
      }
    }
  }
}

module.exports = class SPARQLetParser {
  constructor() {
  }

  parse(markdown) {
    const tokens = marked.lexer(markdown.toString());
    const data = {
      procedures: []
    };
    const ht = new HeadingTracker();
    const pt = new ParametersTracker();
    let endpoint;
    tokens.forEach((token) => {
      if (token.type === 'heading') {
        ht.handle(token.depth, token.text);
        if (token.depth === 1) {
          data.title = token.text;
        }
        return;
      }

      if (ht.isInSection('endpoint')) {
        if (token.type === 'paragraph') {
          endpoint = token.text;
        }
      } else if (ht.isInSection('parameters')) {
        pt.handle(token.type, token.text);
      }
      if (token.type === 'code') {
        switch (token.lang) {
        case 'sparql':
          data.procedures.push({
            type: 'sparql',
            data: token.text,
            bindingName: ht.bindingName(),
            name: ht.latestHeadingText(),
            endpoint: endpoint,
          });
          break;
        case 'js':
        case 'javascript':
          data.procedures.push({
            type: 'javascript',
            data: token.text,
            bindingName: ht.bindingName(),
            name: ht.latestHeadingText(),
          });
          break;
        }
      }
    });
    data.params = pt.params;
    return data;
  }
};
