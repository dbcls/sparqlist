import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),

  actions: {
    async authenticate() {
      try {
        // NOTE identification is not used
        await this.session.authenticate('authenticator:oauth2', '', this.password);
      } catch (res) {
        this.set('errorMessage', res.responseJSON.error || res);
      }
    }
  }
});
