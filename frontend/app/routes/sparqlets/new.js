import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.get('store').createRecord('sparqlet');
  },
  actions: {
    willTransition(transition) {
      this._super(...arguments);
      this.get('controller.model').rollbackAttributes();
    }
  }
});
