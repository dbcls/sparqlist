import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class NewRoute extends Route.extend(AuthenticatedRouteMixin) {
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
    const {model} = this.controller;

    if (model.isNew) {
      model.deleteRecord();
    }

    return true;
  }
}
