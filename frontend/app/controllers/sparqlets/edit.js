import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save() {
      this.get('model').save().then((model) => {
        this.transitionToRoute('sparqlets.show', model);
      }).catch((err) => {
        // TODO handle
        console.error(err);
      });
    }
  }
});
