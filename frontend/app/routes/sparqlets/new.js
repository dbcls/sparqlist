import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NewRoute extends Route {
  @service session;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const model = this.store.createRecord('sparqlet');

    if (params.forkFrom) {
      const origin = await this.store.findRecord('sparqlet', params.forkFrom);

      model.set('src', origin.src);
    }

    return model;
  }

  @action
  willTransition() {
    const { model } = this.controller;

    if (model.isNew) {
      model.deleteRecord();
    }

    return true;
  }
}
