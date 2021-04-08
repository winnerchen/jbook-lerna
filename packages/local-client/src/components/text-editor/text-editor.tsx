import './text-editor.css';
import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Cell } from '../../state';
import { useActions } from '../../hooks/useActions';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const { content } = cell;
  const [editing, setEditing] = useState<boolean>(false);

  const { updateCell } = useActions();

  const ref = useRef<HTMLDivElement | null>(null);

  // const onBlur = (event: React.FocusEvent<HTMLDivElement>): void => {
  //   if (value) {
  //     setEditing(false);
  //   }
  // };

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // clicks inside the MDEditor
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        setEditing(true);
        return;
      }

      setEditing(false);
      return;
    };
    document.addEventListener('click', listener, { capture: true });
    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, [content]);

  if (editing) {
    return (
      <div ref={ref}>
        <MDEditor
          className="text-editor"
          onChange={(v) => {
            updateCell(cell.id, v || '');
          }}
          value={content}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={content || 'Click to edit'} />
      </div>
    </div>
  );
};

export default TextEditor;
