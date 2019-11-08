import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SparqletEditor extends Component {
  @tracked buffer;

  @action
  updateBuffer(content) {
    this.buffer = content;
  }
}
