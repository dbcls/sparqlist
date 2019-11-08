import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import Route from '@ember/routing/route';
import classic from 'ember-classic-decorator';

@classic
export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin) {
}
