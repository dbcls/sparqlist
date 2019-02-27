import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    update(query) {
      const {collection, keys} = this;

      this.set('result', query ? collection.filter((obj) => keys.some((key) => obj.get(key).includes(query))) : collection);
    }
  },

  init() {
    this._super(...arguments);

    this.set('result', this.collection);
  }
});
