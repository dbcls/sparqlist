import Ember from 'ember';

export default Ember.Route.extend({
  model({sparqlet_id}) {
    return this.get('store').findRecord('sparqlet', sparqlet_id);
  },
  actions: {
    willTransition(transition) {
      this._super(...arguments);
      this.get('controller.model').rollbackAttributes();
    }
  }
});
