import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    update(newCode) {
      this.set('isUpdated', newCode !== this.attrs.src.value);
      this.set('code', newCode);
    },
    save() {
      this.sendAction('action', this.get('code'));
    }
  },
  didInsertElement() {
    this.set('code', this.attrs.src.value);
    this.set('mdPath', this.attrs.mdPath.value);
  },
});
