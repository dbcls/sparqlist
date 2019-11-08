import Controller, { inject as controller } from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ShowController extends Controller {
  @service session;
  @controller('sparqlets.new') newSparqlet;

  @tracked error = null;

  @action
  async delete(model) {
    if (!confirm('Are you sure?')) { return; }

    try {
      await model.destroyRecord();

      this.transitionToRoute('sparqlets');
    } catch (e) {
      this.error = e;
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  @action
  fork(model) {
    this.newSparqlet.set('src', model.src);
    this.transitionToRoute('sparqlets.new');
  }
}
