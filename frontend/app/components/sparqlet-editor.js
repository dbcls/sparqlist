import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SparqletEditor extends Component {
  @tracked buffer;
  @tracked name;

  @action
  updateBuffer(content) {
    this.buffer = content;
  }

  @action
  updateName(name) {
    this.name = name;
  }
}
