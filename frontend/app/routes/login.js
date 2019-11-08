import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';

@classic
export default class LoginRoute extends Route.extend(UnauthenticatedRouteMixin) {
  @action
  willTransition() {
    this.controller.errorMessage = null;
  }
}
