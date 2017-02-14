const Handlebars = require('handlebars');
const sparql = require('./sparql');
const LogEntry = require('./log-entry');

module.exports = class SPARQLProcedure {
  constructor(data) {
    this.data = data;
  }

  async execute(context) {
    const logEntries = [];
    const template = Handlebars.compile(this.data.data, {noEscape: true});
    const query = template(context);
    logEntries.push(new LogEntry('SPARQL query', query));
    logEntries.push(new LogEntry('SPARQL endpoint', this.data.endpoint));
    const results = await sparql(query, this.data.endpoint);
    return {
      results,
      logEntries
    };
  }
};
