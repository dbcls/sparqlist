const fsp = require('fs-promise');
const marked = require('marked');
const SPARQLetParser = require('./parser');
const Procedure = require('./procedure');
const LogEntry = require('./log-entry');

module.exports = class SPARQLet {
  constructor(name, markdown) {
    this.name = name;
    this.markdown = markdown;
  }

  index() {
    return marked(this.markdown.toString());
  }

  async execute(params, traceMode) {
    const defaultResolvedParams = this.defaultResolvedParams(params);
    const {traces} = await this.procedures.reduce(async (acc, proc) => {
      const {traces, context} = await acc;
      const ctx = JSON.parse(JSON.stringify(context));
      const {results, logEntries} = await Procedure.create(proc).execute(ctx);

      return {
        context: Object.assign(context, {[proc.name]: results}),
        traces: traces.concat({
          step: {
            name: proc.name,
            type: proc.type
          },
          logEntries,
          results
        })
      };
    }, {traces: [], context: {params: defaultResolvedParams}});

    const results = traces[traces.length-1].results;

    if (traceMode) {
      return {
        results,
        traces
      };
    } else {
      return results;
    }
  }

  defaultResolvedParams(params) {
    const defaults = this.params.reduce((acc, param) => {
      acc[param.name] = param.default;
      return acc;
    }, {});
    return Object.assign(defaults, params);
  }

  apiPath() {
    return '/api/' + this.name + '.json';
  }

  traceModeApiPath() {
    return '/-api/' + this.name + '.json';
  }

  toJSON() {
    return {
      type: 'sparqlet',
      id: this.name,
      attributes: {
        name: this.name,
        title: this.title,
        src: this.markdown.toString(),
        html: this.index(),
        'api-path': this.apiPath(),
        'trace-mode-api-path': this.traceModeApiPath(),
        params: this.params
      }
    };
  }

  static async load(name, markdownPath) {
    const buf = await fsp.readFile(markdownPath);
    const parser = new SPARQLetParser();
    const data = parser.parse(buf);

    const sparqlet = new this(name, buf);
    Object.keys(data).forEach((key) => {
      sparqlet[key] = data[key];
    });

    return sparqlet;
  }

  static save(markdownPath, markdown) {
    return fsp.writeFile(markdownPath, markdown);
  }
};
