import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),

  actions: {
    execute() {
      const path = this.attrs.traceModeApiPath.value;
      const params = this.get('composedParams');

      this.set('isRunning', true);

      this.get('ajax').raw(path, {data: params}).then((data) => {
        this.set('response', {
          ok: true,
          status: data.jqXHR.status,
          statusText: data.jqXHR.statusText,
          contentType: data.payload.contentType,
          results: data.payload.results,
          traces: data.payload.traces
        });
      }).catch((data) => {
        this.set('response', {
          ok: false,
          status: data.jqXHR.status,
          statusText: data.jqXHR.statusText,
          results: data.payload,
          traces: data.payload.traces,
          error: data.payload.error
        });
      }).then(() => {
        this.set('isRunning', false);
      });
    },

    toggleTrace() {
      this.toggleProperty('showTrace');
    }
  },

  actualParams: [],

  composedParams: Ember.computed('actualParams.@each.value', function() {
    const params = this.get('actualParams');

    return params.reduce((acc, p) => Ember.merge(acc, {[p.param.name]: p.value}), {});
  }),

  actualPath: Ember.computed('composedParams', function() {
    const params = this.get('composedParams');
    const path = this.get('apiPath');

    if (Object.keys(params).length === 0) {
      return path;
    } else {
      return `${path}?${Ember.$.param(params)}`;
    }
  }),

  didInsertElement() {
    const params = this.attrs.params.value.map(param => ({param, value: param.default}));

    this.set('actualParams', params);
  },
});
