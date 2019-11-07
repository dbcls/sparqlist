import Component from '@ember/component';
import fetch from 'fetch';
import { computed } from '@ember/object';

function buildURL(path, params) {
  const url = new URL(path, location.origin);

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.append(k, v);
  }

  return url;
}

export default Component.extend({
  actions: {
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
  },

  init() {
    this._super(...arguments);

    this.set('actualParams', []);
  },

  composedParams: computed('actualParams.@each.value', {
    get() {
      return this.actualParams.reduce((acc, p) => Object.assign(acc, {[p.param.name]: p.value}), {});
    }
  }),

  actualUrl: computed('composedParams', 'apiPath', {
    get() {
      return buildURL(this.apiPath, this.composedParams).toString();
    }
  }),

  didInsertElement() {
    const params = this.params.map(param => ({param, value: param.default}));

    this.set('actualParams', params);
  },
});
