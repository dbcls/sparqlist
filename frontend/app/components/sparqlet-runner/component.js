import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),

  actions: {
    execute() {
      const path = this.attrs.traceModeApiPath.value;
      const params = this.get('actualParams');
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
    }
  },
  didInsertElement() {
    const params = this.attrs.params.value.reduce((acc, p) => Ember.merge(acc, {[p.name]: p.default}), {});

    this.set('actualParams', params);
  },
});
