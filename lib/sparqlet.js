const fsp = require('fs-promise');
const marked = require('marked');
const SPARQLetParser = require('./parser');
const Procedure = require('./procedure');

module.exports = class SPARQLet {
  constructor(name, markdown) {
    this.name = name;
    this.markdown = markdown;
  }

  index() {
    return marked(this.markdown.toString());
  }

  async execute(params) {
    const defaultResolvedParams = this.defaultResolvedParams(params);
    const {error, traces} = await this.procedures.reduce(async (acc, proc) => {
      const {traces, context, previous, error} = await acc;
      if (error) {
        return {traces, context, previous, error};
      }
      const ctx = JSON.parse(JSON.stringify(context));

      let results, currentError;
      const logEntries = [];
      try {
        results = await Procedure.create(proc).execute(ctx, previous, logEntries);
      } catch(e) {
        currentError = e.message;
      }

      return {
        previous: results,
        context: ctx,
        traces: traces.concat({
          step: {
            name: proc.name,
            type: proc.type
          },
          logEntries,
          results,
          error: currentError,
        }),
        error: currentError,
      };
    }, {traces: [], context: {params: defaultResolvedParams}});

    const results = traces[traces.length-1].results;

    return {
      error,
      results,
      traces
    };
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
