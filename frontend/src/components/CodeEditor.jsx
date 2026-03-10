import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/theme/base16-light.css';

export default function CodeEditor({ value, onChange }) {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!textareaRef.current || editorRef.current) {
      return undefined;
    }

    const editor = CodeMirror.fromTextArea(textareaRef.current, {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'markdown',
      readOnly: false,
      styleActiveLine: true,
      theme: 'base16-light',
      value: value || '',
      viewportMargin: Infinity,
    });

    editor.on('change', () => {
      onChangeRef.current(editor.getValue());
    });

    editorRef.current = editor;

    return () => {
      editor.toTextArea();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value || '');
    }
  }, [value]);

  return <textarea ref={textareaRef} defaultValue={value || ''} />;
}
