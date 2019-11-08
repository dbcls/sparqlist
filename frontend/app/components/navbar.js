import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NavbarComponent extends Component {
  @service session;

  @action
  logout() {
    this.session.invalidate();
  }
}
