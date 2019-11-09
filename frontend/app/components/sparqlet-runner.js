import Component from '@glimmer/component';
import fetch from 'fetch';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

function buildURL(path, query) {
  const url = new URL(path, location.origin);

  for (const [k, v] of Object.entries(query)) {
    url.searchParams.append(k, v);
  }

  return url;
}

class QueryField {
  @tracked value;

  constructor(param) {
    this.param = param;
    this.value = param.default;
  }
}

export default class SparqletRunner extends Component {
  @tracked response = null;
  @tracked isRunning = false;

  constructor() {
    super(...arguments);

    this.queryFields = this.args.model.params.map(param => new QueryField(param));
  }

  get constructedQuery() {
    return this.queryFields.reduce((acc, {param: {name}, value}) => Object.assign(acc, {[name]: value}), {});
  }

  get constructedURL() {
    return buildURL(this.args.model.apiPath, this.constructedQuery).toString();
  }

  @action
  async execute() {
    this.isRunning = true;

    try {
      const res = await fetch(buildURL(this.args.model.traceModeApiPath, this.constructedQuery), {
        headers: {
          'Accept': 'text/html, application/json, */*; q=0.01'
        }
      });

      const payload = await res.json();

      this.response = {
        ok:          res.ok,
        status:      res.status,
        statusText:  res.statusText,
        contentType: payload.contentType,
        results:     res.ok ? payload.results : payload,
        traces:      payload.traces,
        error:       payload.error,
        elapsed:     payload.elapsed,
      };
    } finally {
      this.isRunning = false;
    }
  }
}
