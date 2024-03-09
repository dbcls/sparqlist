import { modifier } from 'ember-modifier';

export default modifier(
  function evaluateScripts(element) {
    element.querySelectorAll('script').forEach((orig) => {
      const el = document.createElement('script');

      el.textContent = orig.textContent;

      Array.from(orig.attributes).forEach((attr) => {
        el.setAttribute(attr.nodeName, attr.textContent);
      });

      orig.replaceWith(el);
    });
  },
  { eager: true },
);
