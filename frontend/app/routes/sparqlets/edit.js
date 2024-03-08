import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class EditRoute extends Route {
  @service session;
  @service store;

  model(params) {
    return this.store.findRecord('sparqlet', params.sparqlet_id);
  }

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  @action
  willTransition() {
    this.controller.model.rollbackAttributes();

    return true;
  }
}
