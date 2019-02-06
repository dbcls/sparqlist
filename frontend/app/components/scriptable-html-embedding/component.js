import Component from '@ember/component';

export default Component.extend({
  didRender() {
    this._super(...arguments);

    this.element.querySelectorAll('script').forEach((orig) => {
      const el = document.createElement('script');
      el.setAttribute('src', orig.getAttribute('src'));
      el.textContent = orig.textContent;
      orig.replaceWith(el);
    });
  }
});
