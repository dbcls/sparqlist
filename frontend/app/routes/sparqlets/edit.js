import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import classic from 'ember-classic-decorator';

@classic
export default class EditRoute extends Route.extend(AuthenticatedRouteMixin) {
}
