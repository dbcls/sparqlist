import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ShowController extends Controller {
  @service session;

  @action
  async delete(model) {
    if (!confirm('Are you sure?')) { return; }

    try {
      await model.destroyRecord();

      this.transitionToRoute('sparqlets');
    } catch (e) {
      alert(e.toString());

      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}
