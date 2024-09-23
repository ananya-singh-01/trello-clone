import { ActionTypes, BoardActionTypes, BoardsState } from "../../utils/types";

const boardsReducer = (
  state: BoardsState,
  action: BoardActionTypes
): BoardsState => {
  switch (action.type) {
    case ActionTypes.ADD_NEW_BOARD:
      return { ...state, boards: [...state.boards, action.payload] };
    case ActionTypes.REMOVE_BOARD: {
      return {
        ...state,
        boards: state.boards.filter(({ id }) => id !== action.payload),
      };
    }
    case ActionTypes.UPDATE_BOARD:
      return {
        ...state,
        boards: state.boards.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case ActionTypes.ADD_NEW_LIST:
      return {
        ...state,
        boards: state.boards.map((item) =>
          item.id === action.payload.boardId
            ? { ...item, lists: [...item.lists, action.payload] }
            : item
        ),
      };
    case ActionTypes.UPDATE_LIST: {
      return {
        ...state,
        boards: state.boards.map((item) => ({
          ...item,
          lists: item.lists.map((list) =>
            list.boardId !== action.payload.boardId &&
            list.listId !== action.payload.listId
              ? action.payload
              : list
          ),
        })),
      };
    }
    case ActionTypes.REMOVE_LIST:
      return {
        ...state,
        boards: state.boards.map((item) => ({
          ...item,
          lists: item.lists.filter(
            (list) =>
              list.boardId !== action.payload.boardId &&
              list.listId !== action.payload.listId
          ),
        })),
      };
    case ActionTypes.SET_ACTIVE_BOARD:
      return {
        ...state,
        currentActiveBoard: action.payload,
      };
    case ActionTypes.SET_SIDEBAR_STATE:
      return {
        ...state,
        isSidebarOpen: action.payload,
      };
    default:
      return state;
  }
};

export default boardsReducer;
