import './code-editor.css';
import './syntax.css';
import MoancoEditor, { EditorDidMount } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useRef } from 'react';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

interface CodeEditorProps {
  initialValue: string;
  onChange(newValue: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(
    null
  );

  const options: monacoEditor.editor.IEditorConstructionOptions = {
    wordWrap: 'on',
    minimap: {
      enabled: false,
    },
    showUnused: false,
    folding: false,
    fontSize: 16,
    scrollBeyondLastLine: false,
    automaticLayout: true,
  };

  const onEditorDidMount: EditorDidMount = (getValue, editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const value = getValue();
      onChange(value);
    });
    editor.getModel()?.updateOptions({ tabSize: 2 });

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      editor
    );

    // omit the error logging provided by default jsx highlighter
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const unformatted = editorRef.current?.getModel()?.getValue();
    const ref = editorRef.current;
    if (!unformatted || !ref) {
      return;
    }
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');
    ref.setValue(formatted);
    //const selectionEnd = ref.
  };

  return (
    <div className="editor-wrapper" style={{ gridArea: 'codeEditor' }}>
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MoancoEditor
        language="javascript"
        theme="dark"
        options={options}
        value={initialValue}
        editorDidMount={onEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
