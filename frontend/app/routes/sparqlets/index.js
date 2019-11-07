import Route from '@ember/routing/route';
import classic from 'ember-classic-decorator';

@classic
export default class IndexRoute extends Route {
  model() {
    return this.store.findAll('sparqlet');
  }
}
