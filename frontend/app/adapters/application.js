import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'sparqlist/config/environment';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  namespace: `${ENV.rootURL}-api`,
  authorizer: 'ember-simple-auth@authorizer:oauth2-bearer'
});
