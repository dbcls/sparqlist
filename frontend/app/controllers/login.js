import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

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
