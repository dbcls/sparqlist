import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LoginFormComponent extends Component {
  @service session;

  @tracked password = '';
  @tracked errorMessage = null;

  @action
  setPassword({ target: { value } }) {
    this.password = value;
  }

  @action
  async authenticate() {
    try {
      // NOTE identification is not used
      await this.session.authenticate(
        'authenticator:oauth2',
        '',
        this.password
      );
    } catch (res) {
      if (res.ok !== false) {
        throw res;
      } // not a response object

      this.errorMessage = res.responseJSON?.error || res.responseText;
    }
  }
}
