import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  search: computed('query', function() {
    return (id) => {
      const query = this.get('query');

      if (!query) { return true; }

      return id.includes(query);
    }
  })
});
