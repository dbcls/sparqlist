import Component from '@ember/component';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { tagName } from '@ember-decorators/component';

@classic
@tagName('')
export default class CollectionSearch extends Component {
  init() {
    super.init(...arguments);

    this.set('result', this.collection);
  }

  @action
  update(query) {
    const {collection, keys} = this;

    this.set('result', query ? collection.filter((obj) => keys.some((key) => obj.get(key).includes(query))) : collection);
  }
}
