import Controller from '@ember/controller';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

@classic
export default class ApplicationController extends Controller {
  @service session;

  @action
  logout() {
    this.session.invalidate();
  }
}
