import './code-cell.css';
import React, { useEffect } from 'react';
import CodeEditor from './code-editor/index';
import Preview from './preview/index';
import Resizable from './resizable/index';
import { Cell } from '../state';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useCumulativeCode } from '../hooks/use-cumulative-code';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { id, content } = cell;
  const { updateCell, createBundle } = useActions();

  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  const onChange = (value: string) => {
    updateCell(id, value);
  };

  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!bundle) {
      createBundle(id, cumulativeCode);
      return;
    }
    const timer = setTimeout(async () => {
      createBundle(id, cumulativeCode);
    }, 750);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor initialValue={content} onChange={onChange} />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
