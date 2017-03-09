import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save(code, name) {
      const model = this.get('model');
      model.set('name', name);
      model.set('src', code);
      model.save().then((model) => {
        this.transitionToRoute('sparqlets.show', model);
      }).catch((err) => {
        this.set('error', err);
        console.error(err);
      });
    }
  }
});
