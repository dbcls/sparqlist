import Route from '@ember/routing/route';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';

@classic
export default class ShowRoute extends Route {
  @action
  willTransition() {
    this.controller.set('error', null);
  }
}
