import Component from '@ember/component';

export default Component.extend({
  actions: {
    update(newCode) {
      this.set('isUpdated', newCode !== this.get('src'));
      this.set('code', newCode);
    },
    save() {
      this.get('action')(this.get('code'), this.get('name'));
    }
  },
  didInsertElement() {
    this.set('code', this.get('src'));
  },
});
