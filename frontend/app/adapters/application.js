import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'sparqlist/config/environment';
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  session: service(),

  namespace: `${ENV.rootURL}-api`,

  headers: computed('session.data.authenticated.access_token', {
    get() {
      if (!this.session.isAuthenticated) { return {}; }

      return {
        Authorization: `Bearer ${this.session.data.authenticated.access_token}`
      };
    }
  })
});
