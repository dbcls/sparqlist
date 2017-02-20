import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    delete(model) {
      if (!confirm('Are you sure?')) {
        return;
      }
      model.destroyRecord().then(() => {
        this.transitionToRoute('sparqlets');
      }).catch((err) => {
        // TODO handle
        console.error(err);
      });
    }
  }
});
