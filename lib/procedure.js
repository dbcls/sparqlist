const JavaScriptProcedure = require('./javascript-procedure');
const SPARQLProcedure = require('./sparql-procedure');

module.exports = class Procedure {
  static create(data) {
    switch (data.type) {
    case 'javascript':
      return new JavaScriptProcedure(data);
    case 'sparql':
      return new SPARQLProcedure(data);
    default:
      throw 'unsupported procedure type';
    }
  }
};
