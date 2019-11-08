import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SparqletEditor extends Component {
  @tracked error = null;

  @action
  async save() {
    const {model, onSave} = this.args;

    try {
      await model.save();

      if (onSave) {
        onSave();
      }
    } catch (e) {
      this.error = e;
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  @action
  revertUnsavedChanges() {
    this.args.model.rollbackAttributes();
  }
}
