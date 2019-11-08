import JavaScriptProcedure from './javascript-procedure.js';
import SPARQLProcedure from './sparql-procedure.js';

export default class Procedure {
  static create(data) {
    switch (data.type) {
    case 'javascript':
      return new JavaScriptProcedure(data);
    case 'sparql':
      return new SPARQLProcedure(data);
    default:
      throw new Error('unsupported procedure type');
    }
  }
};
