import { action } from '@ember/object';
import { bind } from '@ember/runloop';
import codemirror from 'codemirror';
import Modifier from 'ember-modifier';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/sparql/sparql';

export default class CodeMirrorModifier extends Modifier {
  didInstall() {
    this._setup();
  }

  didUpdateArguments() {
    if (this._editor.getValue() !== this.args.named.content) {
      this._editor.setValue(this.args.named.content);
    }

    this._editor.setOption('readOnly', this.args.named.readOnly);
  }

  @action
  _onChange(editor) {
    this.args.named.onUpdate(editor.getValue());
  }

  _setup() {
    if (!this.element) {
      throw new Error('CodeMirror modifier has no element');
    }

    const editor = codemirror(this.element, {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'markdown',
      readOnly: this.args.named.readOnly,
      styleActiveLine: true,
      theme: 'base16-light',
      value: this.args.named.content || '',
      viewportMargin: Infinity,
    });

    editor.on('change', bind(this, this._onChange));

    this._editor = editor;
  }
}
