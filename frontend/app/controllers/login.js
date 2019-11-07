import Controller from '@ember/controller';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

@classic
export default class LoginController extends Controller {
  @service session;

  @action
  async authenticate() {
    try {
      // NOTE identification is not used
      await this.session.authenticate('authenticator:oauth2', '', this.password);
    } catch (res) {
      this.set('errorMessage', res.responseJSON.error || res);
    }
  }
}
