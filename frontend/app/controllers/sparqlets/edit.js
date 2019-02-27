import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    async save(code) {
      this.model.set('src', code);

      try {
        await this.model.save();

        this.transitionToRoute('sparqlets.show', this.model);
      } catch (e) {
        this.set('error', e);
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }
});
