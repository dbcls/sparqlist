import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SparqletEditor extends Component {
  @service router;

  @tracked error = null;

  @action
  async save() {
    const {model} = this.args;

    try {
      await model.save();

      this.router.transitionTo('sparqlets.show', model);
    } catch (e) {
      this.error = e;
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}
