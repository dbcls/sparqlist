const vm = require('vm');
const util = require('util');
const LogEntry = require('./log-entry');

module.exports = class JavaScriptProcedure {
  constructor(data) {
    this.data = data;
  }

  async execute(context, previous) {
    const script = this.data.data;
    const logs = [];
    const sandbox = {
      console: {
        log() {
          logs.push([...arguments]);
        }
      }
    };
    const results = vm.runInNewContext(script, sandbox)(context, previous);
    const logEntries = logs.map(l => new LogEntry('console', util.format(...l)));
    return {results, logEntries};
  }
};
