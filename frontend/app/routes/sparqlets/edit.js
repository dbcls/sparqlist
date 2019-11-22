import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class EditRoute extends Route.extend(AuthenticatedRouteMixin) {
  @action
  willTransition() {
    this.controller.model.rollbackAttributes();

    return true;
  }
}
