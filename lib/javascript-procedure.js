const Handlebars = require('handlebars');
const LogEntry   = require('./log-entry');
const accepts    = require('accepts');
const fetch      = require('node-fetch');
const mime       = require('mime');
const util       = require('util');
const vm         = require('vm');

module.exports = class JavaScriptProcedure {
  constructor(data) {
    this.data = data;
  }

  async execute(context, logEntries, accept) {
    const script = this.data.data;
    const logs = [];
    const sandbox = {
      console: {
        log() {
          logs.push([...arguments]);
        }
      },
      fetch,
      hbs: Handlebars.create().compile
    };

    logEntries.push(new LogEntry('Script', script));
    let results, contentType;
    try {
      const obj = vm.runInNewContext(script, sandbox);
      if (typeof obj === 'function') {
        results = await obj(context);
        contentType = 'application/json';
      } else {
        const available = Object.keys(obj);
        const req = {headers: {accept}};
        const format = accepts(req).type(available);
        logEntries.push(new LogEntry('Format', format));
        if (!format) {
          throw new Error(`unsupported format`);
        }
        results = await (obj[format](context));
        contentType = mime.lookup(format);
      }
    } finally {
      logEntries.push(...logs.map(l => new LogEntry('console', util.format(...l))));
    }
    return {results, contentType};
  }
};
