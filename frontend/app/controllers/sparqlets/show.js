import Controller, { inject as controller } from '@ember/controller';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

@classic
export default class ShowController extends Controller {
  @service session;
  @controller('sparqlets.new') newSparqlet;

  @action
  async delete(model) {
    if (!confirm('Are you sure?')) { return; }

    try {
      await model.destroyRecord();

      this.transitionToRoute('sparqlets');
    } catch (err) {
      this.set('error', err);
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  @action
  fork(model) {
    this.newSparqlet.set('src', model.src);
    this.transitionToRoute('sparqlets.new');
  }
}
