import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';

@classic
export default class EditRoute extends Route.extend(AuthenticatedRouteMixin) {
  @action
  willTransition() {
    this.controller.model.rollbackAttributes();
    this.controller.set('error', null);
  }
}
