import ENV from 'sparqlist/config/environment';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint:      ENV.rootURL + 'token',
  sendClientIdAsQueryParam: true,
  rejectWithResponse:       true
});
