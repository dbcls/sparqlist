import $ from 'jquery';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  ajax: service(),

  actions: {
    async execute() {
      this.set('isRunning', true);

      try {
        const {jqXHR, payload} = await this.ajax.raw(this.traceModeApiPath, {data: this.composedParams});

        this.set('response', {
          ok:          true,
          status:      jqXHR.status,
          statusText:  jqXHR.statusText,
          contentType: payload.contentType,
          results:     payload.results,
          traces:      payload.traces,
          elapsed:     payload.elapsed,
        });
      } catch ({jqXHR, payload}) {
        this.set('response', {
          ok:         false,
          status:     jqXHR.status,
          statusText: jqXHR.statusText,
          results:    payload,
          traces:     payload.traces,
          error:      payload.error,
          elapsed:    payload.elapsed,
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

  actualPath: computed('composedParams', 'apiPath', {
    get() {
      if (Object.keys(this.composedParams).length === 0) {
        return this.apiPath;
      } else {
        return `${this.apiPath}?${$.param(this.composedParams)}`;
      }
    }
  }),

  didInsertElement() {
    const params = this.params.map(param => ({param, value: param.default}));

    this.set('actualParams', params);
  },
});
