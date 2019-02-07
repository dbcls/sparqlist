import Component from '@ember/component';

export default Component.extend({
  didRender() {
    this._super(...arguments);

    this.element.querySelectorAll('script').forEach((orig) => {
      const el = document.createElement('script');

      el.textContent = orig.textContent;

      Array.from(orig.attributes).forEach((attr) => {
        el.setAttribute(attr.nodeName, attr.textContent);
      });

      orig.replaceWith(el);
    });
  }
});
