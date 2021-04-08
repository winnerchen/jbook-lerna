import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.MOVE_CELL:
        const { id, direction } = action.payload;
        const index = state.order.findIndex((i) => i === id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = id;

        return state;
      case ActionType.DELETE_CELL:
        delete state.data[action.payload.id];
        state.order = state.order.filter((id) => id !== action.payload.id);
        return state;
      case ActionType.UPDATE_CELLS:
        const { content } = action.payload;
        state.data[action.payload.id].content = content;
        return state;
      case ActionType.INSERT_CELL_AFTER:
        const cell = { id: randomId(), type: action.payload.type, content: '' };

        state.data[cell.id] = cell;
        const indexToInsert = state.order.findIndex(
          (i) => i === action.payload.id
        );
        if (indexToInsert < 0) {
          state.order.unshift(cell.id);
          return state;
        }
        state.order.splice(indexToInsert + 1, 0, cell.id);
        return state;
      default:
        return state;
    }
  }
);

const randomId = () => {
  return Math.random().toString(36).substring(2, 5);
};

export default reducer;
