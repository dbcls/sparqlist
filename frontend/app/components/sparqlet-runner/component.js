import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),

  actions: {
    execute() {
      const path = this.attrs.traceModeApiPath.value;
      const params = this.get('actualParams');

      this.get('ajax').raw(path, {data: params}).then((data) => {
        this.set('response', {
          ok: true,
          status: data.jqXHR.status,
          statusText: data.jqXHR.statusText,
          results: JSON.stringify(data.payload.results, null, 2),
          traces: data.payload.traces
        });
      }).catch((data) => {
        this.set('response', {
          ok: false,
          status: data.jqXHR.status,
          statusText: data.jqXHR.statusText,
          results: JSON.stringify(data.payload, null, 2)
        });
      });
    }
  },
  didInsertElement() {
    const params = this.attrs.params.value.reduce((acc, p) => Ember.merge(acc, {[p.name]: p.default}), {});

    this.set('actualParams', params);
  },
});
