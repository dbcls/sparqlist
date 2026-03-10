import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { javascript } from '@codemirror/lang-javascript';
import {
  LanguageDescription,
  LanguageSupport,
  StreamLanguage,
} from '@codemirror/language';
import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { basicSetup } from 'codemirror';

const codeLanguages = [
  LanguageDescription.of({
    name: 'JavaScript',
    alias: ['javascript', 'js', 'jsx', 'mjs', 'cjs'],
    support: javascript(),
  }),
  LanguageDescription.of({
    name: 'SPARQL',
    alias: ['sparql', 'rq'],
    support: new LanguageSupport(StreamLanguage.define(sparql)),
  }),
];

export default function CodeEditor({ value, onChange }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || viewRef.current) {
      return undefined;
    }

    const initialValue = value || '';
    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        basicSetup,
        markdown({ codeLanguages }),
        EditorView.lineWrapping,
        EditorView.theme({
          '&': {
            fontSize: '14px',
          },
        }),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) {
            return;
          }

          onChangeRef.current(update.state.doc.toString());
        }),
      ],
    });
    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;

    if (!view) {
      return;
    }

    const nextValue = value || '';
    const currentValue = view.state.doc.toString();

    if (currentValue !== nextValue) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: nextValue,
        },
      });
    }
  }, [value]);

  return <div className="code-editor" ref={containerRef} />;
}
