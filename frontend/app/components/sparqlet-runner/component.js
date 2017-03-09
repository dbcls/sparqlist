import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),

  actions: {
    execute() {
      const path = this.attrs.traceModeApiPath.value;
      const actualParams = this.get('actualParams');
      const params = actualParams.reduce((acc, p) => Ember.merge(acc, {[p.param.name]: p.value}), {});
      this.set('isRunning', true);

      this.get('ajax').raw(path, {data: params}).then((data) => {
        this.set('isRunning', false);
        this.set('response', {
          ok: true,
          status: data.jqXHR.status,
          statusText: data.jqXHR.statusText,
          contentType: data.payload.contentType,
          results: data.payload.results,
          traces: data.payload.traces
        });
      }).catch((data) => {
        this.set('isRunning', false);
        this.set('response', {
          ok: false,
          status: data.jqXHR.status,
          statusText: data.jqXHR.statusText,
          results: data.payload,
          traces: data.payload.traces,
          error: data.payload.error
        });
      });
    },
    toggleTrace() {
      this.toggleProperty('showTrace');
    }
  },
  actualParams: [],
  actualPath: Ember.computed('actualParams.@each.value', function() {
    const params = this.get('actualParams').reduce((acc, p) => Ember.merge(acc, {[p.param.name]: p.value}), {});
    return this.get('apiPath') + '?' + jQuery.param(params);
  }),
  didInsertElement() {
    const params = this.attrs.params.value.map(param => {
      return {param, value: param.default};
    });

    this.set('actualParams', params);
  },
});
