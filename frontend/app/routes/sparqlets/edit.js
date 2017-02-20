import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
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
