const vm = require('vm');
const util = require('util');
const LogEntry = require('./log-entry');
const mime = require('mime');

module.exports = class JavaScriptProcedure {
  constructor(data) {
    this.data = data;
  }

  async execute(context, logEntries, accepts) {
    const script = this.data.data;
    const logs = [];
    const sandbox = {
      console: {
        log() {
          logs.push([...arguments]);
        }
      }
    };
    logEntries.push(new LogEntry('Script', script));
    let results, contentType;
    try {
      const obj = vm.runInNewContext(`(${script})`, sandbox);
      if (typeof obj === 'function') {
        results = obj(context);
      } else {
        if (accepts === undefined) {
          throw new Error(`content negotitation in the intermediate procedure`);
        }
        const available = Object.keys(obj);
        const format = accepts(available);
        logEntries.push(new LogEntry('Format', format));
        if (!format) {
          throw new Error(`unsupported format`);
        }
        results = obj[format](context);
        contentType = mime.lookup(format);
      }
    } finally {
      logEntries.push(...logs.map(l => new LogEntry('console', util.format(...l))));
    }
    return {results, contentType};
  }
};
