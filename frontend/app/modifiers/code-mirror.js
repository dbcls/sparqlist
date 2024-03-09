import codemirror from 'codemirror';
import Modifier from 'ember-modifier';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/sparql/sparql';

export default class CodeMirrorModifier extends Modifier {
  didSetup = false;

  modify(element, _, { content, onUpdate }) {
    if (!this.didSetup) {
      const editor = codemirror(element, {
        lineNumbers: true,
        matchBrackets: true,
        mode: 'markdown',
        readOnly: false,
        styleActiveLine: true,
        theme: 'base16-light',
        value: content || '',
        viewportMargin: Infinity,
      });

      editor.on('change', () => {
        onUpdate(editor.getValue());
      });

      this.didSetup = true;
    }
  }
}
