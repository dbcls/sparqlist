import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'sparqlist/config/environment';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

@classic
export default class Application extends JSONAPIAdapter.extend(DataAdapterMixin) {
  namespace = `${ENV.rootURL}-api`;

  @service session;

  @computed('session.data.authenticated.access_token')
  get headers() {
    if (!this.session.isAuthenticated) { return {}; }

    return {
      Authorization: `Bearer ${this.session.data.authenticated.access_token}`
    };
  }
}
