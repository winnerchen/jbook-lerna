import './action-bar.css';
import React from 'react';
import { useActions } from '../hooks/useActions';

interface ActionBarProps {
  id: string;
  type: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id, type }) => {
  const { moveCell, deleteCell } = useActions();
  return (
    <div
      className={
        type === 'code' ? 'action-bar-wrapper-code' : 'action-bar-wrapper-text'
      }
    >
      <div className="action-bar">
        <button
          className="button is-primary is-small"
          onClick={() => moveCell(id, 'up')}
        >
          <span className="icon">
            <i className="fas fa-arrow-up"></i>
          </span>
        </button>
        <button
          className="button is-primary is-small"
          onClick={() => moveCell(id, 'down')}
        >
          <span className="icon">
            <i className="fas fa-arrow-down"></i>
          </span>
        </button>
        <button
          className="button is-primary is-small"
          onClick={() => deleteCell(id)}
        >
          <span className="icon">
            <i className="fas fa-times"></i>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
