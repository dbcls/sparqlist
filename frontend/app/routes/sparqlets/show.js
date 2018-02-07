import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    willTransition() {
      this._super(...arguments);
      this.set('controller.error', null);
    }
  }
});
