import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SparqletActionButtonsComponent extends Component {
  @service session;
  @service router;

  @action
  async delete() {
    if (!confirm('Are you sure?')) {
      return;
    }

    try {
      await this.args.model.destroyRecord();

      this.router.transitionTo('sparqlets');
    } catch (e) {
      alert(e.toString());

      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}
