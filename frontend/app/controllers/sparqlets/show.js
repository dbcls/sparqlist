import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  session: service('session'),

  actions: {
    delete(model) {
      if (!confirm('Are you sure?')) {
        return;
      }
      model.destroyRecord().then(() => {
        this.transitionToRoute('sparqlets');
      }).catch((err) => {
        this.set('error', err);
        console.error(err);
      });
    },
    fork(model) {
      this.transitionToRoute('sparqlets.new').then(newRoute => {
        newRoute.currentModel.set('src', model.get('src'));
      });
    }
  }
});
