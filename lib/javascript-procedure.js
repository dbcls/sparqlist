const vm = require('vm');
const util = require('util');
const LogEntry = require('./log-entry');

module.exports = class JavaScriptProcedure {
  constructor(data) {
    this.data = data;
  }

  async execute(context, previous, logEntries) {
    const script = this.data.data;
    const logs = [];
    const sandbox = {
      console: {
        log() {
          logs.push([...arguments]);
        }
      }
    };
    let results;
    try {
      results = vm.runInNewContext(script, sandbox)(context, previous);
    } finally {
      logEntries.push(...logs.map(l => new LogEntry('console', util.format(...l))));
    }
    return results;
  }
};
