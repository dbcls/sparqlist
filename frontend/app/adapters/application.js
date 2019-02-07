import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'sparqlist/config/environment';
import { inject as service } from '@ember/service';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  session: service(),

  namespace: `${ENV.rootURL}-api`,

  authorize(xhr) {
    const token = this.get('session.data.authenticated.access_token');

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  }
});
