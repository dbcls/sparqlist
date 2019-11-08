import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';

@classic
export default class NewRoute extends Route.extend(AuthenticatedRouteMixin) {
  model() {
    return this.store.createRecord('sparqlet');
  }

  @action
  willTransition() {
    this.controller.model.rollbackAttributes();
    this.controller.error = null;
  }
}
