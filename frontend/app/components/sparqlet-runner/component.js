import Component from '@ember/component';
import classic from 'ember-classic-decorator';
import fetch from 'fetch';
import { action, computed } from '@ember/object';

function buildURL(path, params) {
  const url = new URL(path, location.origin);

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.append(k, v);
  }

  return url;
}

@classic
export default class SparqletRunner extends Component {
  @action
  async execute() {
    this.set('isRunning', true);

    try {
      const res = await fetch(buildURL(this.traceModeApiPath, this.composedParams), {
        headers: {
          'Accept': 'text/html, application/json, */*; q=0.01'
        }
      });

      const payload = await res.json();

      this.set('response', {
        ok:          res.ok,
        status:      res.status,
        statusText:  res.statusText,
        contentType: payload.contentType,
        results:     res.ok ? payload.results : payload,
        traces:      payload.traces,
        error:       payload.error,
        elapsed:     payload.elapsed,
      });
    } finally {
      this.set('isRunning', false);
    }
  }

  init() {
    super.init(...arguments);

    this.set('actualParams', this.params.map(param => ({param, value: param.default})));
  }

  @computed('actualParams.@each.value')
  get composedParams() {
    return this.actualParams.reduce((acc, p) => Object.assign(acc, {[p.param.name]: p.value}), {});
  }

  @computed('composedParams', 'apiPath')
  get actualUrl() {
    return buildURL(this.apiPath, this.composedParams).toString();
  }
}
