import ENV from 'sparqlist/config/environment';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default class Oauth2 extends OAuth2PasswordGrant {
  serverTokenEndpoint      = ENV.rootURL + 'token';
  sendClientIdAsQueryParam = true;
  rejectWithResponse       = true;
}
