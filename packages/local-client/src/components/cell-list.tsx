import './cell-list.css';
import React, { useEffect } from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import AddCell from './add-cell';
import CellListItem from './cell-list-item';
import { useActions } from '../hooks/useActions';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => {
      return data[id];
    });
  });

  const { fetchCells } = useActions();
  useEffect(() => {
    fetchCells();
  }, []);

  const renderedCells = cells.map((cell) => {
    return (
      <React.Fragment key={cell.id}>
        <CellListItem cell={cell} />
        <AddCell previousCellId={cell.id} />
      </React.Fragment>
    );
  });

  return (
    <div className="cell-list">
      <AddCell previousCellId={null} forceVisible={cells.length === 0} />
      {renderedCells}
    </div>
  );
};

export default CellList;
