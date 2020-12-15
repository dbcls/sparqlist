import * as commonmark from 'commonmark';

import Procedure from './procedure.mjs';
import SPARQLetParser from './parser.mjs';

export default class SPARQLet {
  constructor(name, markdown, pathPrefix, mtime) {
    this.name       = name;
    this.markdown   = markdown;
    this.pathPrefix = pathPrefix;
    this.mtime      = mtime;
  }

  index() {
    const parser   = new commonmark.Parser();
    const renderer = new commonmark.HtmlRenderer();

    return renderer.render(parser.parse(this.markdown.toString()));
  }

  async execute(query, accept) {
    const t0 = new Date();

    const initValue = {
      context: this.defaultResolvedParams(query),
      traces:  [],
      error:   null
    };

    const {error, traces} = await this.procedures.reduce(async (acc, proc) => {
      const {context, traces, error} = await acc;

      if (error) {
        return {context, traces, error};
      }

      const isFinal       = traces.length === this.procedures.length - 1;
      const clonedContext = JSON.parse(JSON.stringify(context));

      let results, contentType, currentError;

      const logEntries = [];
      const t          = new Date();

      try {
        ({results, contentType} = await Procedure.create(proc).execute(clonedContext, logEntries, isFinal ? accept : undefined));
      } catch (e) {
        currentError = e.stack;
        console.error(e);
      }

      const elapsed     = new Date() - t;
      const nextContext = proc.bindingName ? Object.assign({}, context, {[proc.bindingName]: results}) : context;

      const trace = {
        step: {
          name:        proc.name,
          type:        proc.type,
          bindingName: proc.bindingName
        },
        elapsed,
        logEntries,
        results,
        contentType,
        error: currentError,
      };

      return {
        context: nextContext,
        traces:  traces.concat(trace),
        error:   currentError,
      };
    }, initValue);

    const results     = traces.length > 0 ? traces[traces.length - 1].results : null;
    const contentType = results ? traces[traces.length - 1].contentType : null;
    const elapsed     = new Date() - t0;

    return {
      elapsed,
      error,
      results,
      contentType,
      traces
    };
  }

  defaultResolvedParams(params) {
    const defaults = this.params.reduce((acc, {name, default: _default}) => Object.assign(acc, {[name]: _default}), {});

    return Object.assign(defaults, params);
  }

  apiPath() {
    return `${this.pathPrefix}api/${this.name}`;
  }

  traceModeApiPath() {
    return `${this.pathPrefix}trace/${this.name}`;
  }

  mdPath() {
    return `${this.name}.md`;
  }

  toJSON() {
    return {
      type: 'sparqlet',
      id:   this.name,

      attributes: {
        name:                  this.name,
        title:                 this.title,
        src:                   this.markdown.toString(),
        html:                  this.index(),
        'api-path':            this.apiPath(),
        'trace-mode-api-path': this.traceModeApiPath(),
        params:                this.params,
        'md-path':             this.mdPath(),
        mtime:                 this.mtime,
      }
    };
  }

  static load(name, markdown, pathPrefix, mtime) {
    const parser = new SPARQLetParser();
    const data   = parser.parse(markdown);

    return Object.assign(new this(name, markdown, pathPrefix, mtime), data);
  }
};
