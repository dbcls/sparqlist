import JavaScriptProcedure from './javascript-procedure.mjs';
import SPARQLProcedure from './sparql-procedure.mjs';

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
