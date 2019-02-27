import Component from '@ember/component';

export default Component.extend({
  actions: {
    update(newCode) {
      this.set('isUpdated', newCode !== this.src);
      this.set('code', newCode);
    },
    save() {
      this.action(this.code, this.name);
    }
  },
  didInsertElement() {
    this.set('code', this.src);
  },
});
