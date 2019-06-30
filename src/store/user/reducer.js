import * as types from "./actionTypes";

const initialState = {
  currentUser: null,
  type: types.NONE,
  status: types.NONE,
  result: null,
  error: null,
};

export default function common(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_PROFILE:
      if (action.result) {
        state.currentUser = action.result
      }
      return {
        ...state,
        type: types.USER_PROFILE,
        status: action.status,
        result: action.result,
        error: action.error,
      }
    case types.USER_UPDATE:
      if (action.result) {
        state.currentUser = action.result
      }
      return {
        ...state,
        type: types.USER_UPDATE,
        status: action.status,
        result: action.result,
        error: action.error,
      }
    default:
      return state;
  }
}
