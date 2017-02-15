import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    update(newCode) {
      this.set('code', newCode);
    },
    save() {
      this.sendAction('action', this.get('code'));
    }
  },
  didInsertElement() {
    this.set('code', this.attrs.src.value);
  },
});
