import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CollectionSearch extends Component {
  @tracked result;

  constructor() {
    super(...arguments);

    this.result = this.args.collection;
  }

  @action
  update({target: {value}}) {
    const {collection, keys} = this.args;

    this.result = value ? collection.filter((obj) => keys.some((key) => obj.get(key).includes(value))) : collection;
  }
}
