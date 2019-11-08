import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import classic from 'ember-classic-decorator';

@classic
export default class NewRoute extends Route.extend(AuthenticatedRouteMixin) {
  async model(params) {
    const model = this.store.createRecord('sparqlet');

    if (params.forkFrom) {
      const origin = await this.store.findRecord('sparqlet', params.forkFrom);

      model.set('src', origin.src);
    }

    return model;
  }
}
