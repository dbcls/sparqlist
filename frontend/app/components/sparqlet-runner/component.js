import $ from 'jquery';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { merge } from '@ember/polyfills';

export default Component.extend({
  ajax: service(),

  actions: {
    execute() {
      const path = this.get('traceModeApiPath');
      const params = this.get('composedParams');

      this.set('isRunning', true);

      this.get('ajax').raw(path, { data: params }).then((data) => {
        this.set('response', {
          ok: true,
          status: data.jqXHR.status,
          statusText: data.jqXHR.statusText,
          contentType: data.payload.contentType,
          results: data.payload.results,
          traces: data.payload.traces,
          elapsed: data.payload.elapsed,
        });
      }).catch((data) => {
        this.set('response', {
          ok: false,
          status: data.jqXHR.status,
          statusText: data.jqXHR.statusText,
          results: data.payload,
          traces: data.payload.traces,
          error: data.payload.error,
          elapsed: data.payload.elapsed,
        });
      }).then(() => {
        this.set('isRunning', false);
      });
    }
  },

  init() {
    this._super(...arguments);

    this.set('actualParams', []);
  },

  composedParams: computed('actualParams.@each.value', function () {
    const params = this.get('actualParams');

    return params.reduce((acc, p) => merge(acc, { [p.param.name]: p.value }), {});
  }),

  actualPath: computed('composedParams', function () {
    const params = this.get('composedParams');
    const path = this.get('apiPath');

    if (Object.keys(params).length === 0) {
      return path;
    } else {
      return `${path}?${$.param(params)}`;
    }
  }),

  didInsertElement() {
    const params = this.get('params').map(param => ({ param, value: param.default }));

    this.set('actualParams', params);
  },
});
