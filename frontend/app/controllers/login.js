import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  session: service('session'),

  actions: {
    authenticate() {
      const password = this.get('password');
      // NOTE identification is not used
      this.get('session').authenticate('authenticator:oauth2', '', password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
