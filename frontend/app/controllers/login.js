import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),

  actions: {
    authenticate() {
      // NOTE identification is not used
      this.session.authenticate('authenticator:oauth2', '', this.password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
