import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition() {
      this._super(...arguments);
      this.set('controller.error', null);
    }
  }
});
