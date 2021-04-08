import React from 'react';
import './cell-list-item.css';
import { Cell } from '../state';
import CodeCell from './code-cell';
import TextEditor from './text-editor';
import ActionBar from './action-bar';

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  const renderedCell =
    cell.type === 'code' ? (
      <>
        <ActionBar id={cell.id} type={cell.type} />
        <CodeCell cell={cell} />
      </>
    ) : (
      <>
        <TextEditor cell={cell} />
        <ActionBar id={cell.id} type={cell.type} />
      </>
    );
  return <div className="cell-list-item">{renderedCell}</div>;
};

export default CellListItem;
