import Controller from '@ember/controller';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';

@classic
export default class NewController extends Controller {
  @action
  async save(code, name) {
    this.model.set('name', name);
    this.model.set('src', code);

    try {
      await this.model.save();

      this.transitionToRoute('sparqlets.show', this.model);
    } catch (e) {
      this.set('error', e);
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}
