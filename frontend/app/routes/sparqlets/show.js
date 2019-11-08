import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class ShowRoute extends Route {
  @action
  willTransition() {
    this.controller.error = null;
  }
}
