import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EditController extends Controller {
  @tracked error = null;

  @action
  async save(code) {
    this.model.set('src', code);

    try {
      await this.model.save();

      this.transitionToRoute('sparqlets.show', this.model);
    } catch (e) {
      this.error = e;
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}
