import Component from '@ember/component';
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';

@classic
export default class ScriptableHtmlEmbedding extends Component {
  @action
  evaluateScripts() {
    this.element.querySelectorAll('script').forEach((orig) => {
      const el = document.createElement('script');

      el.textContent = orig.textContent;

      Array.from(orig.attributes).forEach((attr) => {
        el.setAttribute(attr.nodeName, attr.textContent);
      });

      orig.replaceWith(el);
    });
  }
}
