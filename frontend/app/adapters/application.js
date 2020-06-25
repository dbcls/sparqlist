import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import ENV from 'sparqlist/config/environment';

export default class Application extends JSONAPIAdapter {
  namespace = `${ENV.rootURL}-api`;

  @service session;

  @computed('session.{isAuthenticated,data.authenticated.access_token}')
  get headers() {
    if (!this.session.isAuthenticated) { return {}; }

    return {
      Authorization: `Bearer ${this.session.data.authenticated.access_token}`
    };
  }
}
